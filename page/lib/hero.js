import {createElement,EventEmitter,Disposables} from "./utils.js";
import {DataManager} from "./data.js";
import {PluginManager} from "./plugin.js";

export const DEFAULT_HERO_DATA = {
  "plugin.heading.title": "Hero",
  "dsa.plugins": [
    "theme",
    "garbage-tester",
    "data:application/javascript;charset=utf-8," + encodeURIComponent("console.log(import.meta)"),
  ],
  "plugin.theme.theme": "dark-minimal",
  "dsa.pluginsOffline": {
    data: "data:application/javascript;charset=utf-8," + encodeURIComponent("console.log(import.meta)"),
  },
};

export class Hero {
  sections = new Set();
  events = new EventEmitter();
  disposables = new Disposables();
  plugins = new PluginManager(this);

  constructor({
    data = DEFAULT_HERO_DATA,
  }={}) {
    this.title = data.title;
    this.closeButton = createElement("dsa-button",{
      classes: ["dsa-hero-close"],
      events: { click: () => dsa.removeHero(this) },
    });
    this.heading = createElement("dsa-hero-heading",{
      innerText: this.title,
    });
    this.sections = createElement("dsa-hero-top");
    this.sections = createElement("dsa-hero-middle");
    this.sections = createElement("dsa-hero-bottom");
    this.element = createElement("dsa-hero", {
      childs: [this.closeButton,this.heading,this.sections],
    });
    this.casing = createElement("dsa-hero-casing",{
      shadow: { childs: [this.element] },
    });
    this.disposables.add(
      this.data = new DataManager(data),
    );
    // TODO how to handle unhandled data
  }

  addSection(section) {

  }

  export() {
    const data = {
      title: this.title,
      config: config.config,
    };
    this.events.emit("export-to", data);
    return data;
  }

  dispose() {
    this.disposables.dispose();
  }

  onExportTo(callback) { return this.events.on( "export-to", callback ); }
}

export class HeroSection {
  events = new EventEmitter();
  disposables = new Disposables();

  constructor() {
    this.element = createElement("dsa-hero-selction");
  }
}
