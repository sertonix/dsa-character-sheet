export class DataManager {
  data = Object.create(null);
  redirects = Object.create(null);
  observer = Object.create(null);

  get(name) {
    if (this.redirects[name]) {
      if (!this.redirects[name].get) throw new Error(`data redirector for ${JSON.stringify(name)} doesn't allow getting`);
      return this.redirects[name].get();
    }
    return this.data[name];
  }

  set(name,value) {
    if (this.redirects[name]) {
      if (!this.redirects[name].set) throw new Error(`data redirector for ${JSON.stringify(name)} doesn't allow setting`);
      this.redirects[name].set(value);
      return;
    }
    const oldValue = this.data[name];
    if (value === oldValue) return;
    if (name != null) {
      this.data[name] = value;
    } else {
      delete this.data[name];
    }
    this.triggerObserver(name,value,oldValue);
  }

  setRedirect(name,get,set) {
    if (this.data[name]) throw new Error(`redirected data ${JSON.stringify(name)} that was already set`);
    if (this.redirects[name]) throw new Error(`overwriting data redirect for ${JSON.stringify(name)}`);
    return this.redirects[name] = { get, set };
  }

  getRedirect(name) { return this.redirects[name]; }
  isRedirected(name) { return !!this.redirects[name]; }

  removeRedirect(name) {
    if (!this.redirects[name]) throw new Error(`removed redirector for ${JSON.stringify(name)} that doesn't exists`);
    delete this.redirects[name];
  }

  triggerObserver(name,newValue,oldValue) {
    this.observer[name]?.forEach( cb => cb(newValue,oldValue) );
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
