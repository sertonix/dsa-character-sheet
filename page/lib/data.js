export class DataManager {
  data = Object.create(null);
  observer = Object.create(null);

  get(name) {
    return this.data[name];
  }

  set(name,value) {
    const oldValue = this.data[name];
    if (value === oldValue) return;
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
    const foundObserver = this.observer[name]?.delete(callback);
    if (!foundObserver) throw new Error(`could not find observer for ${JSON.stringify(name)}`);
    if (!this.observer[name].size) delete this.observer[name];
  }
}
