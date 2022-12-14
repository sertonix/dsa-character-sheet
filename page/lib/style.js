import {EventEmitter} from "./event.js";
import {URI} from "./uri.js";

export class StyleManager {
  styles = new Set();
  element = document.createElement("dsa-style-manager");

  add(uri) {
    const style = new Style(this,uri);
    this.styles.add(style);
    this.append(style.getOuterElement());
    return style;
  }

  remove(style) {
    if (!this.styles.has(style)) return;
    this.styles.delete(style);
  }

  getAll() { return [...this.styles]; }

  getOuterElement() { return this.element; }
  append(...elements) { return this.element.append(...elements); }
}

export class Style {
  element = document.createElement("link");

  constructor(styles,uri) {
    this.styles = styles;
    this.uri = uri;
    this.element.setAttribute("rel","styleSheet");
    this.element.setAttribute("href",this.resolveURI());
  }

  resolveURI() {
    return dsa.resolveURI(this.uri);
  }

  setURI(uri) {
    this.uri = uri;
    this.element.setAttribute("href",this.resolveURI());
  }

  addToElement(element) {
    element.append(this.element);
  }

  getOuterElement() { return this.element; }
}
