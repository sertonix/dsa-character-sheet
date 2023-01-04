import {DataManager} from "./data.js";
import {Sections} from "./section.js";
import {StyleManager} from "./style.js";
import {PluginManager} from "./plugin.js";

export class Character {
  element = document.createElement("dsa-character");
  sections = new Sections();
  style = new StyleManager();
  plugins = new PluginManager();
  data = new DataManager();

  constructor() {
    this.element.append(
      this.style.element,
      this.sections.element,
    );
  }

  initialize() {
    this.plugins.initialize();
  }
}
