import {EventEmitter} from "./event.js";
import {URIResolver} from "./uri-resolver.js";
import {URI} from "./uri.js";

export class PluginManager {
  uriResolver = new URIResolver();
  plugins = new Map();
  events = new EventEmitter();
  defaultPlugins = [
    "dsa-plugin:theme-base",
    "dsa-plugin:theme-black-and-white", // TODO easily disable when different theme is used
    "dsa-plugin:title",
    "dsa-plugin:import-export",
    "dsa-plugin:attributes",
  ];

  constructor() {
    this.uriResolver.setProxy("dsa",URI.join(import.meta.url,"."),".js");
    this.uriResolver.setProxy("dsa-plugin",URI.join(import.meta.url,"../plugins/"),".js","index");
  }

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
    this.events.emit("did-added-plugin", plugin);
    return plugin;
  }

  remove(...uris) {
    for (const uri of uris) {
      if (!this.plugins.has(uri)) continue;
      const plugin = this.plugins.get(uri);
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
    this.load = import(this.plugins.resolveURI(this.uri)).then( this.handleImports.bind(this) );
  }

  handleImports(exports) {
    this.exports = exports;
    this.loaded = true;
    return this.handleFinishedImport();
  }

  handleFinishedImport() {
    const configSchema = this.getExport("configSchema");
    if (configSchema) dsa.character.config.addSchema(configSchema);
    this.getExport("add")?.();
    const styleURI = this.getExport("styleURI");
    if (styleURI) dsa.character.style.set(`dsa-plugin:${this.uri}`,this.resolveStyleURI(styleURI));
    return this;
  }

  getExport(name) {
    return this.exports[name] ?? this.exports.default?.[name];
  }

  resolveStyleURI(uri) {
    return this.plugins.resolveURI(URI.join(this.plugins.resolveURI(this.uri),uri));
  }
}
