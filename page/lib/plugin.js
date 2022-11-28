import {EventEmitter,deltaArrays,Disposables,uniqueArray} from "./utils.js";

export class PluginManager {
  plugins = new Map();
  events = new EventEmitter();
  disposables = new Disposables();
  baseURL = new URL("../plugins/",import.meta.url);
  defaultPlugins = [
    "theme",
    "garbage-tester",
  ];

  initialize() {
    this.disposables.add(
      dsa.onDidAddedHero( hero => {
        hero.data.onDidChange("dsa.plugins", (newUrls,oldUrls) => {
          const [added,removed] = deltaArrays(shouldPlugins,arePlugins);
          this.removeHeroFrom(hero,...removed);
          this.addHeroTo(hero,...added);
        });
        this.addHeroTo(hero,...hero.data.get("dsa.plugins"));
      }),
      dsa.onDidRemovedHero( hero => this.removeHeroFrom(hero,...hero.data.get("dsa.plugins")) ),
    );
    this.addAll(...this.defaultPlugins);
  }

  add(url) {
    if (this.plugins.has(url)) return this.plugins.get(url);
    const plugin = new Plugin(this,url);
    this.plugins.set(url,plugin);
    this.events.emit("did-added-plugin", plugin);
    return plugin;
  }

  addAll(...urls) { return urls.map( url => this.add(url) ); }
  addHeroTo(hero,...urls) { urls.forEach( url => this.add(url)?.addHero(hero) ); }

  removeHeroFrom(hero,...urls) {
    for (const url of urls) {
      const plugin = this.get(url);
      if (!plugin) continue;
      plugin.removeHero(hero);
      if (plugin.required()) continue;
      this.remove(plugin.url);
    }
  }

  remove(...urls) {
    for (const url of urls) {
      if (!this.plugins.has(url)) continue;
      this.plugins.delete(url);
      this.events.emit("did-removed-plugin", url);
    }
  }

  get(url) { return this.plugins.get(url); }
  getAll() { return [...this.plugins.values()]; }
  getAllUrls() { return [...this.plugins.keys()]; }
  removeAll() { this.remove(...this.plugins.getAllUrls()); }

  has(url) { return this.plugins.has(url); }

  getImportURL(url) {
    if (/^[a-z]+(?:-[a-z]+)*$/.test(url)) {
      return new URL(url + "/index.js", this.baseURL).toString();
    }
    return url;
  }

  requiredPlugin(plugin) {
    return this.defaultPlugins.includes(plugin.url);
  }

  dispose() {
    this.removeAll();
    this.disposables.dispose();
  }

  onDidAddedPlugin(callback) { return this.events.on( "did-added-plugin", callback ); }
  onDidRemovedPlugin(callback) { return this.events.on( "did-removed-plugin", callback ); }
}

export class Plugin {
  loaded = false;
  heros = new Map();
  events = new EventEmitter();

  constructor(plugins,url) {
    this.plugins = plugins;
    this.url = url;
    this.load = import(this.plugins.getImportURL(this.url)).then( e => {
      this.exports = e;
      this.loaded = true;
      if (this.exports.addHero) this.getAllHeros().forEach( hero =>
        this.heros.set(hero,this.exports.addHero(hero))
      );
      return this;
    });
  }

  addHero(...heros) {
    heros.forEach( hero => {
      if (this.heros.has(hero)) return;
      this.heros.set(hero,this.exports?.addHero?.(hero));
    });
  }

  getAllHeros() { return [...this.heros.keys()] }

  removeHero(...heros) {
    heros.forEach( hero => {
      this.heros.get(hero)?.dispose();
      this.heros.delete(hero);
    });
  }

  required() {
    return this.heros.size !== 0 || this.plugins.requiredPlugin(this);
  }

  dispose() {
    this.heros.values().forEach( disposable => disposable?.dispose?.() );
  }
}
