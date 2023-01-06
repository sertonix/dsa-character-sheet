import {EventEmitter} from "./event.js";
import {URI} from "./uri.js";

export class PluginManager {
  plugins = new Map();
  events = new EventEmitter();
  defaultPlugins = [
    // "dsa-plugin:theme-base",
    // "dsa-plugin:theme-black-and-white", // TODO easily disable when different theme is used
    // "dsa-plugin:title",
    // "dsa-plugin:import-export",
    // "dsa-plugin:attributes",
  ];

  initialize() {
    this.addAll(...this.defaultPlugins);
  }

  add(uri) {
    if (this.plugins.has(uri)) return this.plugins.get(uri);
    const plugin = new Plugin(uri);
    this.plugins.set(uri,plugin);
    plugin.load();
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
    this.exports = await import(this.uri);
    await this.getExport("load")?.();
    this.loaded = true;
    const styleURI = this.getExport("styleURI");
    if (styleURI) this.style = dsa.style.add(URI.join(this.uri,styleURI));
  }

  async unload() {
    if (this.style) dsa.style.remove(this.style);
    await this.getExport("unload")?.();
  }

  getExport(name) {
    return this.exports[name] ?? this.exports.default?.[name];
  }
}
