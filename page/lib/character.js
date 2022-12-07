import {DataManager} from "./data.js";
import {HeroPluginManager} from "./plugin.js";
import {ThemeManager} from "./theme.js";
import {StyleManager} from "./style.js";
import {HorizontalBar} from "./bar.js";
import {Sections} from "./section.js";

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

  getOuterElement() { return this.element.casing; }
  append(...elements) { this.element.main.append(...elements); }
}
