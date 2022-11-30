import {EventEmitter,Disposable} from "./utils.js";

// TODO allow values getter
export class DataManager {
  events = new EventEmitter();
  schemas = new Set();

  constructor(data = {}) {
    this.data = data;
  }

  get(name) {
    return this.data[name] ?? this.getSchemaFor(name)?.default;
  }

  set(name,value) {
    if (this.data[name] === name || (name == null && this.data[name] == null)) return;
    const schema = this.getSchemaFor(name);
    if (schema && !this.matchesSchema(value,schema)) throw new Error(`value ${JSON.stringify(value)} doesn't match schema ${JSON.stringify(schema)}`);
    const oldValue = this.data[name];
    if (name != null) {
      this.data[name] = value;
    } else {
      delete this.data[name];
    }
    this.events.emit( "did-change", name, value, oldValue );
    this.events.emit( `did-change-${name}`, value, oldValue );
  }

  exportString({space}={}) {
    return JSON.stringify(this.data,null,space);
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
    return new Disposable( () => this.removeSchema(schema) );
  }

  getSchemaFor(name) {
    for (const schema of this.schemas) {
      if (schema[name]) return schema[name];
    }
  }

  matchesType(data,schema) {
    const {type,min,max,items} = schema;
    if (!type || type === "any") return true;
    if (type === "string") return typeof data === "string";
    if (type === "number" || type === "integer") {
      if (typeof data !== "number") return false;
      if (type === "integer" && !Number.isInteger(data)) return false;
      if (min != null && data >= min) return true;
      if (max != null && data <= max) return true;
    }
    if (type === "boolean") return typeof data === "boolean";
    if (type === "object") return typeof data === "object";
    if (type === "array") {
      if (!Array.isArray(data)) return false;
      return data.every( data => this.matchesSchema(data,items) );
    }
  }

  matchesSchema(data,schema) {
    if (!schema) return true;
    if (data == null) return !schema.required;
    if (schema.options && !schema.options.includes(data)) return false;
    return this.matchesType(data,schema);
  }

  removeSchema(schema) {
    this.schemas.delete(schema);
  }

  onDidAnyChange(callback) { return this.events.on( "did-change", callback ); }
  onDidChange(name,callback) { return this.events.on( `did-change-${name}`, callback ); }
}
