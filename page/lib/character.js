import {EventEmitter} from "./utils.js";
import {DataManager} from "./data.js";
import {HeroPluginManager} from "./plugin.js";
import {ThemeManager} from "./theme.js";
import {StyleManager} from "./style.js";
import {dataSchema} from "./data-schema.js";
import {HorizontalBar} from "./bar.js";

export class Character {
  sections = new Set();
  events = new EventEmitter();
  plugins = new HeroPluginManager(this);
  style = new StyleManager(this);
  theme = new ThemeManager(this);
  topBar = new HorizontalBar();
  bottomBar = new HorizontalBar();
  element = {
    middle: document.createElement("dsa-character-middle"),
    main: document.createElement("dsa-character"),
    casing: document.createElement("dsa-character-casing"),
  };

  constructor(data = {}) {
    this.data = new DataManager(data);
    this.element.casing.attachShadow({mode: "open"}).append(this.element.main);

    this.topBar.getOuterElement().classList.add("dsa-character-top");
    this.bottomBar.getOuterElement().classList.add("dsa-character-bottom");

    this.append(
      this.topBar.getOuterElement(),
      this.element.middle,
      this.bottomBar.getOuterElement(),
    );
    this.data.addSchema(dataSchema);
  }

  initialize() {
    this.style.initialize();
    this.theme.initialize();
    this.plugins.initialize();
  }

  append(...elements) { this.element.main.append(...elements); }
  appendToMiddle(...elements) { this.element.middle.append(...elements); }
  getOuterElement() { return this.element.casing; }

  addSection(section) {
    // TODO
  }

  exportString(options) {
    return this.data.exportString(options);
  }

  dispose() {
    this.theme.dispose();
    this.style.dispose();
    this.plugins.dispose();
    this.topBar.dispose();
    this.bottomBar.dispose();

    this.element.casing.remove();
    this.element.main.remove();
    this.element.middle.remove();
  }
}

export class CharacterSection {
  events = new EventEmitter();

  constructor() {
    this.element = document.createElement("dsa-character-selction");
  }
}
