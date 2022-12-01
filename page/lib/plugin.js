import {EventEmitter,deltaArrays,Disposables} from "./utils.js";

// TODO save plugins for offline use
// TODO provider and consumer
export class PluginManager {
  plugins = new Map();
  events = new EventEmitter();
  baseURL = new URL("../plugins/",import.meta.url);
  defaultPlugins = [
    "garbage-tester",
    "heading",
    "close-button",
    "import-export",
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

  remove(...urls) {
    for (const url of urls) {
      if (!this.plugins.has(url)) continue;
      const plugin = this.plugins.get(url);
      this.plugins.delete(url);
      plugin.dispose();
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

  dispose() {
    this.remove(...this.getAllURLs());
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
    if (this.plugins.character) {
      const dataSchema = this.getExport("dataSchema");
      const styleURL = this.getExport("styleURL");
      if (dataSchema) this.disposables.mayAdd(this.plugins.character.data.addSchema(dataSchema));
      this.disposables.mayAdd(this.getExport("addCharacter")?.(this.plugins.character));
      if (styleURL) this.plugins.character.style.add(this.resolveStyleURL(styleURL));
    } else {
      this.disposables.mayAdd(this.exports.add?.());
    }
    return this;
  }

  getExport(name) {
    return this.exports[name] ?? this.exports?.[name];
  }

  resolveURL() {
    return this.plugins.resolveURL(this.url);
  }

  resolveStyleURL(url) {
    return new URL(url,this.resolveURL());
  }

  dispose() {
    this.plugins.remove(this.url);
    this.disposables.dispose();
  }
}
