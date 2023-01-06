export class DataManager {
  data = Object.create(null);
  observer = Object.create(null);

  get(name) {
    return this.data[name];
  }

  set(name,value) {
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
}
