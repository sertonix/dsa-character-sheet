import {ConfigManager} from "./config.js";
import {HeroPluginManager} from "./plugin.js";
import {StyleManager} from "./style.js";
import {HorizontalBar} from "./bar.js";
import {Sections} from "./section.js";

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

  constructor(config) {
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

    this.style.set("base",dsa.resolveURI("dsa-theme:base"));
    this.config.observe( "dsa.theme", uri =>
      this.style.set("theme",dsa.resolveURI(this.config.get("dsa.theme")))
    );
  }

  initialize() {
    this.plugins.initialize();
  }

  getOuterElement() { return this.element.casing; }
  append(...elements) { this.element.main.append(...elements); }
}
