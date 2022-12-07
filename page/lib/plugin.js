import {EventEmitter} from "./event.js";

export class PluginManager {
  pluginClass = Plugin;
  plugins = new Map();
  events = new EventEmitter();
  baseURL = new URL("../plugins/",import.meta.url);
  defaultPlugins = [
    "garbage-tester",
    "title",
    "character-view-controls",
    "import-export",
    "attributes",
  ];

  initialize() {
    this.addAll(...this.getInitialPlugins());
    if (new URLSearchParams(window.location.search).has("test")) this.add("test"); // TODO remove/replace test
  }

  getInitialPlugins() {
    return this.defaultPlugins;
  }

  add(url) {
    if (this.plugins.has(url)) return this.plugins.get(url);
    const plugin = new this.pluginClass(this,url);
    this.plugins.set(url,plugin);
    this.events.emit("did-added-plugin", plugin);
    return plugin;
  }

  remove(...urls) {
    for (const url of urls) {
      if (!this.plugins.has(url)) continue;
      const plugin = this.plugins.get(url);
      this.plugins.delete(url);
      this.events.emit("did-removed-plugin", url);
    }
  }

  addAll(...urls) { return urls.map( url => this.add(url) ); }
  get(url) { return this.plugins.get(url); }
  getAll() { return [...this.plugins.values()]; }
  getAllURLs() { return [...this.plugins.keys()]; }
  has(url) { return this.plugins.has(url); }

  resolveURL(url) {
    if (/^[a-z]+(?:-[a-z]+)*$/.test(url)) {
      return new URL(url + "/index.js", this.baseURL).toString();
    }
    return url;
  }

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
    this.character.data.onDidChange("dsa.plugins", (newURLs,oldURLs) => {
      for (const oldURL of oldURLs) {
        if (newURLs.includes(oldURL)) continue;
        this.remove(oldURL);
      }
      for (const newURL of newURLs) {
        if (!oldURLs.includes(newURL)) continue;
        this.add(newURL);
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

  constructor(plugins,url) {
    this.plugins = plugins;
    this.url = url;
    this.load = import(this.resolveURL()).then( this.handleImports.bind(this) );
  }

  handleImports(exports) {
    this.exports = exports;
    this.loaded = true;
    return this.handleFinishedImport();
  }

  handleFinishedImport() {
    this.getExport("add")?.();
    return this;
  }

  getExport(name) {
    return this.exports[name] ?? this.exports.default?.[name];
  }

  resolveURL() {
    return this.plugins.resolveURL(this.url);
  }

  resolveStyleURL(url) {
    return new URL(url,this.resolveURL());
  }
}

export class HeroPlugin extends Plugin {
  handleFinishedImport() {
    const dataSchema = this.getExport("dataSchema");
    if (dataSchema) this.plugins.character.data.addSchema(dataSchema);
    this.getExport("addCharacter")?.(this.plugins.character);
    const styleURL = this.getExport("styleURL");
    if (styleURL) this.plugins.character.style.add(this.resolveStyleURL(styleURL));
    return this;
  }
}
