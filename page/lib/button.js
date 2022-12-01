import {EventEmitter} from "./utils.js";

export class ButtonPanel {
  buttons = new Set();
  element = document.createElement("dsa-buttons");

  addNew(...options) {
    const button = new Button(...options);
    this.add(button);
    return button;
  }

  add(button) {
    this.buttons.add(button);
    this.append(button.getOuterElement());
  }

  getOuterElement() {
    return this.element;
  }

  append(...elements) { this.element.append(...elements); }

  dispose() {
    this.element.remove();
  }
}

export class Button {
  events = new EventEmitter();
  element = document.createElement("dsa-button");

  constructor(text,onClick) {
    this.element.addEventListener( "click", event => this.events.emit( "click", event ) );
    this.onClick(onClick);
    this.element.innerText = text;
  }

  getOuterElement() {
    return this.element;
  }

  dispose() {
    this.element.remove();
  }

  onClick(callback) { return this.events.on( "click", callback ); }
}
