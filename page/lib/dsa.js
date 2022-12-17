import {EventEmitter} from "./event.js";
import {PluginManager} from "./plugin.js";
import {Character} from "./character.js";
import {StyleManager} from "./style.js";
import {ButtonPanel} from "./button.js";
import {URIResolver} from "./uri-resolver.js";
import {URI} from "./uri.js";

export class DSA {
  characters = new Set();
  events = new EventEmitter();
  plugins = new PluginManager();
  buttons = new ButtonPanel();
  style = new StyleManager();
  uriResolver = new URIResolver();
  element = {
    main: document.createElement("dsa"),
    characters: document.createElement("dsa-characters"),
  };

  constructor() {
    this.uriResolver.setProxy("dsa",URI.join(import.meta.url,"."),".js");
    this.uriResolver.setProxy("dsa-plugin",URI.join(import.meta.url,"../plugins/"),".js","index");
    this.uriResolver.setProxy("dsa-theme",URI.join(import.meta.url,"../themes/"),".css","index");

    this.append(
      this.style.getOuterElement(),
      this.element.characters,
      this.buttons.getOuterElement(),
    );

    this.buttons.addNew("New", () => this.addCharacter());
  }

  initialize() {
    this.style.set("base","dsa-theme:base");
    this.plugins.initialize();
  }

  addCharacter(rawCharacter) {
    const character = Character.from(rawCharacter);
    this.element.characters.appendChild(character.getOuterElement());
    this.characters.add(character);
    character.initialize();
    this.events.emit("did-added-character", character);
    return character;
  }

  resolveURI(uri) {
    return this.uriResolver.resolve(uri);
  }

  import(uri) {
    return import(this.resolveURI(uri));
  }

  getCharacters() { return [...this.characters]; }

  removeCharacter(character) {
    if (!this.characters.has(character)) return;
    this.characters.delete(character);
    this.element.characters.removeChild(character.getOuterElement());
  }

  getOuterElement() { return this.element.main; }
  append(...elements) { this.element.main.append(...elements); }
  appendToButtons(...elements) { this.element.buttons.append(...elements); }

  onDidAddedCharacter(callback) { return this.events.on( "did-added-character", callback ); }
}
