const {EventEmitter} = await fileSystem.i("./event.js",import.meta.url);

export class PluginManager {
  plugins = new Map();
  events = new EventEmitter();

  initialize() {
  }

  add(uri,load = true) {
    if (this.plugins.has(uri)) return this.plugins.get(uri);
    const plugin = new Plugin(uri);
    this.plugins.set(uri,plugin);
    if (load) plugin.load();
    this.events.emit("did-added-plugin", plugin);
    return plugin;
  }

  remove(...uris) {
    for (const uri of uris) {
      if (!this.plugins.has(uri)) continue;
      this.plugins.delete(uri);
      this.plugins.get(uri).unload().then( () =>
        this.events.emit("did-removed-plugin", uri),
      );
    }
  }

  addAll(...uris) { return uris.map( uri => this.add(uri) ); }
  get(uri) { return this.plugins.get(uri); }
  getAll() { return [...this.plugins.values()]; }
  getAllURIs() { return [...this.plugins.keys()]; }
  has(uri) { return this.plugins.has(uri); }

  onDidAddedPlugin(callback) { return this.events.on( "did-added-plugin", callback ); }
  onDidRemovedPlugin(callback) { return this.events.on( "did-removed-plugin", callback ); }
}

export class Plugin {
  enabled = false;
  enablePromise = undefined;
  disablePromise = undefined;
  loaded = false;
  loadPromise = undefined;
  exports = undefined;
  style = undefined;

  constructor(uri) {
    this.uri = uri;
  }

  enable() {
    return this.enablePromise ||= this.makeEnablePromise();
  }
  
  async makeEnablePromise() {
    if (this.enabled) return;
    if (this.disablePromise) {
      this.disablePromise.stop = true;
      await this.disablePromise;
    }
    if (this.enablePromise.stop) return this.enablePromise = undefined;
    await this.load();
    if (this.enablePromise.stop) return this.enablePromise = undefined;
    await this.getExport("enable")?.(this);
    this.enabled = true;
    this.enablePromise = undefined;
  }
  
  load() {
    return this.loadPromise ||= this.makeLoadPromise();
  }

  async makeLoadPromise() {
    this.exports = await import(this.uri);
    const styleURI = this.getExport("styleURI");
    if (styleURI) this.style = dsa.style.add(new URL(styleURI,this.uri));
    this.loaded = true;
  }
  
  disable() {
    return this.disablePromise ||= this.makeDisablePromise();
  }
  
  async makeDisablePromise() {
    if (!this.enabled) return;
    if (this.enablePromise) {
      this.enablePromise.stop = true;
      await this.enablePromise;
    }
    if (this.disablePromise.stop) return this.disablePromise = undefined;
    await this.getExport("disable")?.();
    this.enabled = false;
    this.disablePromise = undefined;
  }

  getExport(name) {
    if (!this.exports) throw new Error("no exports defined yet");
    return this.exports[name] ?? this.exports.default?.[name];
  }
}
