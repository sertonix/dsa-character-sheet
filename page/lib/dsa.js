import {EventEmitter} from "./utils.js";
import {PluginManager} from "./plugin.js";
import {Character} from "./character.js";
import {ButtonPanel} from "./button.js";

export class DSA {
  characters = new Set();
  events = new EventEmitter();
  plugins = new PluginManager();
  buttons = new ButtonPanel();
  element = {
    main: document.createElement("dsa"),
    characters: document.createElement("dsa-characters"),
  };

  constructor() {
    this.append(
      this.element.characters,
      this.buttons.getOuterElement(),
    );

    this.buttons.addNew("New", () => this.addCharacter());
    this.buttons.addNew("Import", () => alert("Not available jet"));
  }

  initialize() {
    this.plugins.initialize();
  }

  append(...elements) { this.element.main.append(...elements); }
  appendToCharacters(...elements) { this.element.characters.append(...elements); }
  appendToButtons(...elements) { this.element.buttons.append(...elements); }

  getOuterElement() {
    return this.element.main;
  }

  addCharacter(data) {
    const character = new Character(data);
    this.appendToCharacters(character.getOuterElement());
    this.characters.add(character);
    character.initialize();
    this.events.emit("did-added-character", character);
    return character;
  }

  getCharacters() { return [...this.characters]; }

  removeCharacter(character) {
    if (!this.characters.has(character)) return;
    this.characters.delete(character);
    character.dispose();
    this.events.emit("did-removed-character");
  }

  removeAllCharacters() {
    this.characters.forEach( character => this.removeCharacter(character) );
  }

  dispose() {
    this.removeAllCharacters();
    this.plugins.dispose();
  }

  onDidAddedCharacter(callback) { return this.events.on( "did-added-character", callback ); }
  onDidRemovedCharacter(callback) { return this.events.on( "did-removed-character", callback ); }
}
