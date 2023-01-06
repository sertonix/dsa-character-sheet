import {DataManager} from "./data.js";
import {Sections} from "./section.js";
import {StyleManager} from "./style.js";
import {PluginManager} from "./plugin.js";

export class Character {
  element = {
    main: document.createElement("dsa-character"),
  };
  sections = new Sections();
  style = new StyleManager();
  plugins = new PluginManager();
  data = new DataManager();

  constructor() {
    for (const pos of ["top","center","bottom"]) {
      const element = document.createElement("dsa-container");
      element.setAttribute("axis","horizontal");
      element.setAttribute("pos",pos);
      this.element.main.append(element);
      this.element[pos === "center" ? "horizontalCenter" : pos] = element;
    }
    for (const pos of ["left","center","right"]) {
      const element = document.createElement("dsa-container");
      element.setAttribute("axis","vertical");
      element.setAttribute("pos",pos);
      this.element.horizontalCenter.append(element);
      this.element[pos] = element;
    }
    
    this.element.center.append(this.sections.element);
    this.element.main.append(this.style.element);
  }

  initialize() {
    this.plugins.initialize();
  }
}
