import {ConfigManager} from "./config.js";
import {Sections} from "./section.js";
import {StyleManager} from "./style.js";
import {PluginManager} from "./plugin.js";
import {safeJSONParse} from "./safe-json-parse.js";

const FORMAT_VERSION = 1;

export class Character {
  element = document.createElement("dsa-character");
  sections = new Sections();
  style = new StyleManager();
  plugins = new PluginManager();

  constructor({
    config,
    data = {},
    formatVersion = FORMAT_VERSION,
  } = {}) {
    if (formatVersion !== FORMAT_VERSION) throw new Error(`Invalid format version! got ${formatVersion} expected ${FORMAT_VERSION}`);
    this.data = data;
    this.config = new ConfigManager(config);

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
    return {
      formatVersion: FORMAT_VERSION,
      config: this.config.export(),
      data: this.data,
      // TODO tempData: {},
    };
  }

  static from(raw) {
    return new Character(
      typeof raw === "string" ?
        safeJSONParse(raw) :
        raw
    );
  }
}
