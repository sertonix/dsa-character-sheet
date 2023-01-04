import {EventEmitter} from "./event.js";

export class DataManager {
  events = new EventEmitter();
  schemas = new Set();

  constructor(config = Object.create(null)) {
    this.config = config; // TODO remove object prototypes
  }

  get(name) {
    return this.config[name] ?? this.getSchemaFor(name)?.default;
  }

  set(name,value) {
    if (this.config[name] === name || (name == null && this.config[name] == null)) return;
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
    this.onDidChange( name, callback );
    callback(this.get(name));
  }

  export() {
    return this.config;
  }

  onDidAnyChange(callback) { return this.events.on( "did-change", callback ); }
  onDidChange(name,callback) { return this.events.on( `did-change-${name}`, callback ); }
}
