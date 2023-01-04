function safeObject(k,v) {
  return v && typeof v === "object" && !Array.isArray(v) ? Object.setPrototypeOf(v, null) : v;
}

export function safeJSONParse(str) { // TODO allow reviver
  return JSON.parse(str,safeObject);
}

export class DataManager {
  data = Object.create(null);
  observer = Object.create(null);

  get(name) {
    return this.data[name];
  }

  set(name,value) {  // TODO remove object prototypes
    if (this.data[name] === name || (name == null && this.data[name] == null)) return;
    const oldValue = this.data[name];
    if (name != null) {
      this.data[name] = value;
    } else {
      delete this.data[name];
    }
    this.observer[name]?.forEach( cb => cb(value,oldValue) );
  }

  addObserver(name,callback) {
    (this.observer[name] ||= new Set()).add(callback);
    callback(this.get(name));
  }

  removeObserver(name,callback) {
    this.observer[name]?.delete(callback);
  }

  export() {
    return this.data;
  }
}
