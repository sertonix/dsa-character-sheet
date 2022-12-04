import {DataManager} from "./data.js";
import {HeroPluginManager} from "./plugin.js";
import {ThemeManager} from "./theme.js";
import {StyleManager} from "./style.js";
import {HorizontalBar} from "./bar.js";

export class Character {
  plugins = new HeroPluginManager(this);
  style = new StyleManager(this);
  theme = new ThemeManager(this);
  topBar = new HorizontalBar();
  bottomBar = new HorizontalBar();
  sections = new Sections();
  element = {
    main: document.createElement("dsa-character"),
    casing: document.createElement("dsa-character-casing"),
  };

  constructor(data) {
    this.data = new DataManager(data);
    this.element.casing.attachShadow({mode: "open"}).append(this.element.main);

    this.topBar.getOuterElement().classList.add("dsa-character-top");
    this.bottomBar.getOuterElement().classList.add("dsa-character-bottom");

    this.append(
      this.topBar.getOuterElement(),
      this.sections.getOuterElement(),
      this.bottomBar.getOuterElement(),
    );
  }

  initialize() {
    this.style.initialize();
    this.theme.initialize();
    this.plugins.initialize();
  }

  append(...elements) { this.element.main.append(...elements); }
  getOuterElement() { return this.element.casing; }

  exportString(options) {
    return this.data.exportString(options);
  }

  dispose() {
    this.theme.dispose();
    this.style.dispose();
    this.plugins.dispose();
    this.topBar.dispose();
    this.bottomBar.dispose();
    this.sections.dispose();

    this.element.casing.remove();
    this.element.main.remove();
  }
}

export class Sections {
  sections = new Set();
  element = document.createElement("dsa-character-sections");

  add(section) {
    this.sections.add(section);
    this.append(section.getOuterElement());
  }

  remove(section) {
    this.sections.delete(section);
    this.removeChild(section.getOuterElement());
  }

  append(...elements) { this.element.append(...elements); }
  getOuterElement() { return this.element; }
  removeChild(child) { this.element.removeChild(child); }

  dispose() {

  }
}

export class Section {
  events = new EventEmitter();
  element = document.createElement("dsa-character-section");

  getOuterElement() { return this.element; }
}
