import {EventEmitter} from "./event.js";
import {URIResolver} from "./uri-resolver.js";
import {URI} from "./uri.js";

export class PluginManager {
  uriResolver = new URIResolver();
  plugins = new Map();
  events = new EventEmitter();
  defaultPlugins = [
    // "dsa-plugin:theme-base",
    // "dsa-plugin:theme-black-and-white", // TODO easily disable when different theme is used
    // "dsa-plugin:title",
    // "dsa-plugin:import-export",
    // "dsa-plugin:attributes",
  ];

  resolveURI(uri) {
    return this.uriResolver.resolve(uri);
  }

  import(uri) {
    return import(this.resolveURI(uri));
  }

  initialize() {
    this.addAll(...this.defaultPlugins);
  }

  add(uri) {
    if (this.plugins.has(uri)) return this.plugins.get(uri);
    const plugin = new Plugin(this,uri);
    this.plugins.set(uri,plugin);
    plugin.load();
    this.events.emit("did-added-plugin", plugin);
    return plugin;
  }

  remove(...uris) {
    for (const uri of uris) {
      if (!this.plugins.has(uri)) continue;
      this.plugins.get(uri).unload();
      this.plugins.delete(uri);
      this.events.emit("did-removed-plugin", uri);
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
  events = new EventEmitter();

  constructor(plugins,uri) {
    this.plugins = plugins;
    this.uri = uri;
  }

  load() {
    return this.loadPromise ||= this.makeLoadPromise();
  }

  async makeLoadPromise() {
    this.exports = await import(this.plugins.resolveURI(this.uri));
    await this.getExport("load")?.();
    this.loaded = true;
    const styleURI = this.getExport("styleURI");
    if (styleURI) dsa.style.set(`dsa-plugin:${this.uri}`,this.resolveStyleURI(styleURI));
  }

  async unload() {
    // await this.loadPromise;
    await this.getExport("unload")?.();
  }

  getExport(name) {
    return this.exports[name] ?? this.exports.default?.[name];
  }

  resolveStyleURI(uri) {
    return URI.join(this.uri,uri);
  }
}
