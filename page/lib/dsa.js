import {createElement,EventEmitter,Disposables} from "./utils.js";
import {PluginManager} from "./plugin.js";
import {Hero} from "./hero.js";

export class DSA {
  heros = new Set();
  events = new EventEmitter();
  disposables = new Disposables();

  constructor() {
    this.disposables.add(
      this.plugins = new PluginManager(),
    );
    this.herosElement = createElement("dsa-heros",{
      parent: document.body,
    });
    this.buttonsElement = createElement("dsa-buttons",{
      parent: document.body,
      rawChilds: [
        {
          tag: "dsa-button",
          innerText: "New",
          events: {
            click: () => this.addHero(),
          },
        },
        {
          tag: "dsa-button",
          innerText: "Import",
          events: {
            click: () => alert("Not available jet"), // TODO
          },
        },
      ],
    });
  }

  initialize() {
    this.plugins.initialize();
  }

  addHero(data) {
    const hero = new Hero(data);
    this.herosElement.appendChild(hero.casing);
    this.heros.add(hero);
    this.events.emit("did-added-hero", hero);
    return hero;
  }

  removeHero(hero) {
    if (!this.heros.has(hero)) return;
    this.heros.delete(hero);
    this.herosElement.removeChild(hero.casing);
    this.events.emit("did-removed-hero",hero);
    hero.dispose();
  }

  removeAllHeros() {
    this.heros.forEach( hero => this.removeHero(hero) );
  }

  dispose() {
    this.removeAllHeros();
    this.disposables.dispose();
  }

  onDidAddedHero(callback) { return this.events.on( "did-added-hero", callback ); }
  onDidRemovedHero(callback) { return this.events.on( "did-removed-hero", callback ); }
  onDispose(callback) { return this.disposables.onDispose( callback ); }
}
