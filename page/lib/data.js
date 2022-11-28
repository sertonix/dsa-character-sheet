import {EventEmitter,Disposables} from "./utils.js";

// TODO data schema for validation
export class DataManager {
  events = new EventEmitter();
  disposables = new Disposables();

  constructor(data = {}) {
    this.data = data;
  }

  get(name) {
    return this.data[name] ?? (name === "packages" ? [] : undefined);
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

  dispose() { this.disposables.dispose(); }

  onDidAnyChange(callback) { return this.events.on( "did-change", callback ); }
  onDidChange(name,callback) { return this.events.on( `did-change-${name}`, callback ); }
}
