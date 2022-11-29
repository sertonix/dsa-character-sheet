import {EventEmitter} from "./utils.js";
import {DataManager} from "./data.js";
import {HeroPluginManager} from "./plugin.js";
import {ThemeManager} from "./theme.js";
import {StyleManager} from "./style.js";
import {dataSchema} from "./data-schema.js";

export class Character {
  sections = new Set();
  events = new EventEmitter();
  plugins = new HeroPluginManager(this);
  style = new StyleManager(this);
  theme = new ThemeManager(this);
  element = {
    top: document.createElement("dsa-character-top"),
    middle: document.createElement("dsa-character-middle"),
    bottom: document.createElement("dsa-character-bottom"),
    main: document.createElement("dsa-character"),
    casing: document.createElement("dsa-character-casing"),
  };

  constructor(data = {}) {
    this.data = new DataManager(data);
    this.element.casing.attachShadow({mode: "open"}).append(this.element.main);

    this.element.main.append(
      this.element.top,
      this.element.middle,
      this.element.bottom,
    );
    this.data.addSchema(dataSchema);
  }


  initialize() {
    this.style.initialize();
    this.theme.initialize();
    this.plugins.initialize();
  }

  append(...elements) { this.element.main.append(...elements); }
  appendToTop(...elements) { this.element.top.append(...elements); }
  appendToMiddle(...elements) { this.element.middle.append(...elements); }
  appendToBottom(...elements) { this.element.bottom.append(...elements); }

  getOuterElement() {
    return this.element.casing;
  }

  addSection(section) {
    // TODO
  }

  export() {
    return this.data.export();
  }

  dispose() {
    this.element.casing.remove();
    this.element.main.remove();
    this.element.top.remove();
    this.element.middle.remove();
    this.element.bottom.remove();
  }
}

export class CharacterSection {
  events = new EventEmitter();

  constructor() {
    this.element = document.createElement("dsa-character-selction");
  }
}
