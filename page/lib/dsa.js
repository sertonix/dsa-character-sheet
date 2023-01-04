import {EventEmitter} from "./event.js";
import {Character} from "./character.js";

export class DSA {
  character = new Character();
  events = new EventEmitter();

  constructor() {
    document.body.append(this.character.element);
  }

  initialize() {
    this.character.initialize();
  }
}
