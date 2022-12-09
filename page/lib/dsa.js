import {EventEmitter} from "./event.js";
import {PluginManager} from "./plugin.js";
import {Character} from "./character.js";
import {ButtonPanel} from "./button.js";
import {URIResolver} from "./uri-resolver.js";
import {URI} from "./uri.js";

export class DSA {
  characters = new Set();
  events = new EventEmitter();
  plugins = new PluginManager();
  buttons = new ButtonPanel();
  uriResolver = new URIResolver();
  element = {
    main: document.createElement("dsa"),
    characters: document.createElement("dsa-characters"),
  };

  constructor() {
    const libURI = URI.join(import.meta.url,".");
    this.uriResolver.set("dsa", uri => new URI({
      ...libURI,
      path: URI.joinPath(libURI.path,uri),
    }));
    const pluginURI = URI.join(import.meta.url,"../plugins/");
    this.uriResolver.set("dsa-plugin", uri => new URI({
      ...pluginURI,
      path: URI.joinPath(pluginURI.path,URI.fixedPath(uri.path), "index.js"),
    }));
    const themeURI = URI.join(import.meta.url,"../themes/");
    this.uriResolver.set("dsa-theme", uri => new URI({
      ...themeURI,
      path: URI.joinPath(themeURI.path,URI.fixedPath(uri.path), "index.css"),
    }));

    this.append(
      this.element.characters,
      this.buttons.getOuterElement(),
    );

    this.buttons.addNew("New", () => this.addCharacter());
  }

  initialize() {
    this.plugins.initialize();
  }

  addCharacter(data) {
    const character = new Character(data);
    this.appendToCharacters(character.getOuterElement());
    this.characters.add(character);
    character.initialize();
    this.events.emit("did-added-character", character);
    return character;
  }

  resolveURI(uri) {
    return this.uriResolver.resolve(uri);
  }

  getCharacters() { return [...this.characters]; }

  removeCharacter(character) {
    if (!this.characters.has(character)) return;
    this.characters.delete(character);
  }

  getOuterElement() { return this.element.main; }
  append(...elements) { this.element.main.append(...elements); }
  appendToCharacters(...elements) { this.element.characters.append(...elements); }
  appendToButtons(...elements) { this.element.buttons.append(...elements); }

  onDidAddedCharacter(callback) { return this.events.on( "did-added-character", callback ); }
}
