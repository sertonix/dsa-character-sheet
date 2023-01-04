import {EventEmitter} from "./event.js";
import {PluginManager} from "./plugin.js";
import {Character} from "./character.js";
import {URI} from "./uri.js";

export class DSA {
  character = new Character();
  events = new EventEmitter();
  plugins = new PluginManager();

  constructor() {
    document.body.append(this.character.element);
  }

  initialize() {
    this.plugins.initialize();
  }
}
