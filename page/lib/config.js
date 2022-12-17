import {EventEmitter} from "./event.js";
import {configSchema} from "./config-schema.js";

export class ConfigManager {
  events = new EventEmitter();
  schemas = new Set();

  constructor(config = Object.create(null), baseSchema = configSchema) {
    this.config = config; // TODO remove object prototypes

    this.addSchema(baseSchema);
  }

  get(name) {
    return this.config[name] ?? this.getSchemaFor(name)?.default;
  }

  set(name,value) {
    if (this.config[name] === name || (name == null && this.config[name] == null)) return;
    const schema = this.getSchemaFor(name);
    if (schema && !this.matchesSchema(value,schema)) throw new Error(`value ${JSON.stringify(value)} doesn't match schema ${JSON.stringify(schema)}`);
    const oldValue = this.config[name];
    if (name != null) {
      this.config[name] = value;
    } else {
      delete this.config[name];
    }
    this.events.emit( "did-change", name, value, oldValue );
    this.events.emit( `did-change-${name}`, value, oldValue );
  }

  observe(name,callback) {
    this.onDidAnyChange( name, callback );
    callback(this.get(name));
  }

  export() {
    return this.config;
  }

  addSchema(schema) {
    for (const [name,subSchema] of Object.entries(schema)) {
      const value = this.get(name);
      if (!this.matchesSchema(value,subSchema)) {
        throw new Error(`value ${JSON.stringify(value)} doesn't match schema ${JSON.stringify(subSchema)}`);
      }
      if (!this.matchesSchema(subSchema.default,subSchema)) {
        throw new Error(`default value ${JSON.stringify(value)} doesn't match schema ${JSON.stringify(subSchema)}`);
      }
    }
    this.schemas.add(schema);
  }

  getSchemaFor(name) {
    for (const schema of this.schemas) {
      if (schema[name]) return schema[name];
    }
  }

  matchesType(config,schema) {
    const {type,min,max,items} = schema;
    if (!type || type === "any") return true;
    if (type === "string") return typeof config === "string";
    if (type === "number" || type === "integer") {
      if (typeof config !== "number") return false;
      if (type === "integer" && !Number.isInteger(config)) return false;
      if (min != null && config >= min) return true;
      if (max != null && config <= max) return true;
    }
    if (type === "boolean") return typeof config === "boolean";
    if (type === "object") return typeof config === "object"; // TODO key and property schema
    if (type === "array") {
      if (!Array.isArray(config)) return false;
      return config.every( config => this.matchesSchema(config,items) );
    }
  }

  matchesSchema(config,schema) {
    if (!schema) return true;
    if (config == null) return !schema.required;
    if (schema.options && !schema.options.includes(config)) return false;
    return this.matchesType(config,schema);
  }

  removeSchema(schema) {
    this.schemas.delete(schema);
  }

  onDidAnyChange(callback) { return this.events.on( "did-change", callback ); }
  onDidChange(name,callback) { return this.events.on( `did-change-${name}`, callback ); }
}
