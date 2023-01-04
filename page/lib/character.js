import {ConfigManager} from "./config.js";
import {HorizontalBar} from "./bar.js";
import {Sections} from "./section.js";
import {StyleManager} from "./style.js";
import {safeJSONParse} from "./safe-json-parse.js";

const FORMAT_VERSION = 1;

export class Character {
  element = document.createElement("dsa-character");
  topBar = new HorizontalBar();
  sections = new Sections();
  bottomBar = new HorizontalBar();
  style = new StyleManager();

  constructor({
    config,
    data = {},
    formatVersion = FORMAT_VERSION,
  } = {}) {
    if (formatVersion !== FORMAT_VERSION) throw new Error(`Invalid format version! got ${formatVersion} expected ${FORMAT_VERSION}`);
    this.data = data;
    this.config = new ConfigManager(config);

    this.topBar.getOuterElement().classList.add("dsa-character-top");
    this.bottomBar.getOuterElement().classList.add("dsa-character-bottom");

    this.append(
      this.style.element,
      this.topBar.getOuterElement(),
      this.sections.getOuterElement(),
      this.bottomBar.getOuterElement(),
    );
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
