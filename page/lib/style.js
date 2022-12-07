import {EventEmitter} from "./event.js";

export class StyleManager {
  styles = new Set();
  events = new EventEmitter();
  baseURL = new URL("../style/character/",import.meta.url);
  element = document.createElement("dsa-style-manager");

  constructor(character) {
    this.character = character;
  }

  initialize() {
    this.character.append(this.element);
  }

  add(url) {
    const style = new Style(this,url);
    this.styles.add(style);
    this.append(style.getOuterElement());
    return style;
  }

  remove(style) {
    if (!this.styles.has(style)) return;
    this.styles.delete(style);
  }

  getAll() { return [...this.styles]; }

  resolveURL(url) {
    if (/^[a-z]+(?:-[a-z]+)*$/.test(url)) {
      return new URL(url + "/index.css", this.baseURL).toString();
    }
    return url;
  }

  append(...elements) { return this.element.append(...elements); }
}

export class Style {
  element = document.createElement("link");

  constructor(styles,url) {
    this.styles = styles;
    this.url = url;
    this.element.setAttribute("rel","styleSheet");
    this.element.setAttribute("href",this.resolveURL());
  }

  resolveURL() {
    return this.styles.resolveURL(this.url);
  }

  setURL(url) {
    this.url = url;
    this.element.setAttribute("href",this.resolveURL());
  }

  addToElement(element) {
    element.append(this.element);
  }

  getOuterElement() { return this.element; }
}
