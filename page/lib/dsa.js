import {EventEmitter} from "./event.js";
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
