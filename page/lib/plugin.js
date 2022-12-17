import {EventEmitter} from "./event.js";
import {URI} from "./uri.js";

export class PluginManager {
  pluginClass = Plugin;
  plugins = new Map();
  events = new EventEmitter();
  defaultPlugins = [
    "dsa-plugin:garbage-tester",
    "dsa-plugin:title",
    "dsa-plugin:character-view-controls",
    "dsa-plugin:import-export",
    "dsa-plugin:attributes",
  ];

  initialize() {
    this.addAll(...this.getInitialPlugins());
  }

  getInitialPlugins() {
    return this.defaultPlugins;
  }

  add(uri) {
    if (this.plugins.has(uri)) return this.plugins.get(uri);
    const plugin = new this.pluginClass(this,uri);
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

export class HeroPluginManager extends PluginManager {
  pluginClass = HeroPlugin;

  constructor(character) {
    super();
    this.character = character;
  }

  initialize() {
    super.initialize();
    this.character.data.onDidChange("dsa.plugins", (newURIs,oldURIs) => {
      for (const oldURI of oldURIs) {
        if (newURIs.includes(oldURI)) continue;
        this.remove(oldURI);
      }
      for (const newURI of newURIs) {
        if (!oldURIs.includes(newURI)) continue;
        this.add(newURI);
      }
    });
    this.character.data.onDidChange("dsa.plugins.default-enabled", enabled => {
      if (enabled) {
        this.addAll(...this.defaultPlugins);
      } else {
        this.remove(...this.defaultPlugins);
      }
    });
  }

  getInitialPlugins() {
    return [
      ...this.character.data.get("dsa.plugins.default-enabled") ? this.defaultPlugins : [],
      ...this.character.data.get("dsa.plugins"),
    ];
  }
}

export class Plugin {
  loaded = false;
  events = new EventEmitter();

  constructor(plugins,uri) {
    this.plugins = plugins;
    this.uri = uri;
    this.load = import(dsa.resolveURI(this.uri)).then( this.handleImports.bind(this) );
  }

  handleImports(exports) {
    this.exports = exports;
    this.loaded = true;
    return this.handleFinishedImport();
  }

  handleFinishedImport() {
    this.getExport("add")?.();
    const styleURI = this.getExport("styleURI");
    if (styleURI) dsa.style.set(`dsa-plugin:${this.uri}`,this.resolveStyleURI(styleURI));
    return this;
  }

  getExport(name) {
    return this.exports[name] ?? this.exports.default?.[name];
  }

  resolveStyleURI(uri) {
    return dsa.resolveURI(URI.join(dsa.resolveURI(this.uri),uri));
  }
}

export class HeroPlugin extends Plugin {
  handleFinishedImport() {
    const dataSchema = this.getExport("dataSchema");
    if (dataSchema) this.plugins.character.data.addSchema(dataSchema);
    this.getExport("addCharacter")?.(this.plugins.character);
    const styleURI = this.getExport("styleURI");
    if (styleURI) this.plugins.character.style.set(`dsa-plugin:${this.uri}`,this.resolveStyleURI(styleURI));
    return this;
  }
}
