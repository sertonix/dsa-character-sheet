import {EventEmitter,deltaArrays,Disposables,Disposable} from "./utils.js";

export class PluginManager {
  plugins = new Map();
  events = new EventEmitter();
  baseURL = new URL("../plugins/",import.meta.url);
  defaultPlugins = [
    "garbage-tester",
    "heading",
    "close-button",
  ];

  initialize() {
    this.addAll(...this.getInitialPlugins());
  }

  getInitialPlugins() {
    return this.defaultPlugins;
  }

  add(url) {
    if (this.plugins.has(url)) return this.plugins.get(url);
    const plugin = new Plugin(this,url);
    this.plugins.set(url,plugin);
    this.events.emit("did-added-plugin", plugin);
    return plugin;
  }

  addAll(...urls) { return urls.map( url => this.add(url) ); }

  remove(...urls) {
    for (const url of urls) {
      if (!this.plugins.has(url)) continue;
      this.plugins.get(url).dispose();
      this.plugins.delete(url);
      this.events.emit("did-removed-plugin", url);
    }
  }

  get(url) { return this.plugins.get(url); }
  getAll() { return [...this.plugins.values()]; }
  getAllURLs() { return [...this.plugins.keys()]; }
  removeAll() { this.remove(...this.plugins.getAllURLs()); }

  has(url) { return this.plugins.has(url); }

  resolveURL(url) {
    if (/^[a-z]+(?:-[a-z]+)*$/.test(url)) {
      return new URL(url + "/index.js", this.baseURL).toString();
    }
    return url;
  }

  dispose() {
    this.removeAll();
  }

  onDidAddedPlugin(callback) { return this.events.on( "did-added-plugin", callback ); }
  onDidRemovedPlugin(callback) { return this.events.on( "did-removed-plugin", callback ); }
}

export class HeroPluginManager extends PluginManager {
  constructor(character) {
    super();
    this.character = character;
  }

  initialize() {
    this.character.data.onDidChange("dsa.plugins", (newURLs,oldURLs) => {
      const [added,removed] = deltaArrays(newURLs,oldURLs);
      this.remove(...removed);
      this.addAll(...added);
    });
    this.character.data.onDidChange("dsa.plugins.default-enabled", enabled => {
      if (enabled) {
        this.addAll(...this.defaultPlugins);
      } else {
        this.remove(...this.defaultPlugins);
      }
    });
    super.initialize();
  }

  getInitialPlugins() {
    return [
      ...this.character.data.get("dsa.plugins.default-enabled") ? this.defaultPlugins : [],
      ...this.character.data.get("dsa.plugins")
    ];
  }
}

export class Plugin {
  loaded = false;
  events = new EventEmitter();
  disposables = new Disposables();

  constructor(plugins,url) {
    this.plugins = plugins;
    this.url = url;
    this.load = import(this.resolveURL()).then( this.handleFinishedImport.bind(this) );
  }

  handleFinishedImport(exports) {
    this.exports = exports;
    this.loaded = true;
    this.disposables.add(
      ...this.plugins.character ? [
        this.exports.dataSchema && this.plugins.character.data.addSchema(this.exports.dataSchema),
        this.exports.addCharacter?.(this.plugins.character),
      ] : [
        this.exports.add?.(),
      ],
    );
    return this;
  }

  resolveURL() {
    return this.plugins.resolveURL(this.url);
  }

  dispose() {
    this.disposables.dispose();
  }
}
