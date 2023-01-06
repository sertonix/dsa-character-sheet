import {EventEmitter} from "./event.js";
import {URI} from "./uri.js";

export class PluginManager {
  plugins = new Map();
  events = new EventEmitter();
  defaultPlugins = [
    "theme-base/index.js",
    "theme-black-and-white/index.js", // TODO easily disable when different theme is used
    "title/index.js",
    // "import-export/index.js",
    // "attributes/index.js",
  ];

  initialize() {
    this.addAll(...this.defaultPlugins); // TODO move to data instead
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
  loaded = false;
  style = undefined;

  constructor(uri) {
    this.uri = uri;
  }

  load() {
    return this.loadPromise ||= this.makeLoadPromise();
  }

  async makeLoadPromise() {
    this.exports = await import(URI.join(import.meta.url,"../plugins/",this.uri));
    this.loaded = true;
    const styleURI = this.getExport("styleURI");
    if (styleURI) this.style = dsa.style.add(URI.join(import.meta.url,"../plugins/",this.uri,styleURI));
  }

  async unload() {
    if (this.style) dsa.style.remove(this.style);
    await this.getExport("unload")?.();
  }

  getExport(name) {
    return this.exports[name] ?? this.exports.default?.[name];
  }
}
