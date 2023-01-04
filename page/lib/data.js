import {EventEmitter} from "./event.js";

function safeObject(k,v) {
  return v && typeof v === "object" && !Array.isArray(v) ? Object.setPrototypeOf(v, null) : v;
}

export function safeJSONParse(str) { // TODO allow reviver
  return JSON.parse(str,safeObject);
}

export class DataManager {
  events = new EventEmitter();
  schemas = new Set();

  constructor(data = Object.create(null)) {
    this.data = data; // TODO remove object prototypes
  }

  get(name) {
    return this.data[name] ?? this.getSchemaFor(name)?.default;
  }

  set(name,value) {
    if (this.data[name] === name || (name == null && this.data[name] == null)) return;
    const oldValue = this.data[name];
    if (name != null) {
      this.data[name] = value;
    } else {
      delete this.data[name];
    }
    this.events.emit( "did-change", name, value, oldValue );
    this.events.emit( `did-change-${name}`, value, oldValue );
  }

  observe(name,callback) {
    this.onDidChange( name, callback );
    callback(this.get(name));
  }

  export() {
    return this.data;
  }

  onDidAnyChange(callback) { return this.events.on( "did-change", callback ); }
  onDidChange(name,callback) { return this.events.on( `did-change-${name}`, callback ); }
}
