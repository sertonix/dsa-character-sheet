import {DataManager} from "./data.js";
import {Sections} from "./section.js";
import {StyleManager} from "./style.js";
import {PluginManager} from "./plugin.js";

const FORMAT_VERSION = 1;

export class Character {
  element = document.createElement("dsa-character");
  sections = new Sections();
  style = new StyleManager();
  plugins = new PluginManager();
  data = new DataManager();

  constructor() {
    this.append(
      this.style.element,
      this.sections.getOuterElement(),
    );
  }

  initialize() {
    this.plugins.initialize();
  }

  getOuterElement() { return this.element; }
  append(...elements) { this.element.append(...elements); }

  export() {
    return this.data.export();
  }
}
