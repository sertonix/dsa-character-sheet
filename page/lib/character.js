import {ConfigManager} from "./config.js";
import {HeroPluginManager} from "./plugin.js";
import {StyleManager} from "./style.js";
import {HorizontalBar} from "./bar.js";
import {Sections} from "./section.js";
import {safeJSONParse} from "./safe-json-parse.js";

const FORMAT_VERSION = 1;

export class Character {
  element = {
    main: document.createElement("dsa-character"),
    casing: document.createElement("dsa-character-casing"),
  };
  style = new StyleManager();
  topBar = new HorizontalBar();
  sections = new Sections();
  bottomBar = new HorizontalBar();
  plugins = new HeroPluginManager(this);

  constructor({
    config,
    data,
    formatVersion = FORMAT_VERSION,
  } = {}) {
    if (formatVersion !== FORMAT_VERSION) throw new Error(`Invalid format version! got ${formatVersion} expected ${FORMAT_VERSION}`);
    this.data = data;
    this.config = new ConfigManager(config);
    this.element.casing.attachShadow({mode: "open"}).append(this.element.main);

    this.topBar.getOuterElement().classList.add("dsa-character-top");
    this.bottomBar.getOuterElement().classList.add("dsa-character-bottom");

    this.append(
      this.style.getOuterElement(),
      this.topBar.getOuterElement(),
      this.sections.getOuterElement(),
      this.bottomBar.getOuterElement(),
    );

    this.style.set("dsa.base",dsa.resolveURI("dsa-theme:base"));
    this.config.observe( "dsa.theme", uri =>
      this.style.set("theme",dsa.resolveURI(this.config.get("dsa.theme")))
    );
  }

  initialize() {
    this.plugins.initialize();
  }

  getOuterElement() { return this.element.casing; }
  append(...elements) { this.element.main.append(...elements); }

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
