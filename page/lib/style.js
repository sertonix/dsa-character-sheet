export class StyleManager {
  styles = Object.create(null);
  element = document.createElement("dsa-style-manager");

  set(id,uri) {
    if (uri == null) {
      this.styles[id].remove();
      delete this.styles[id];
      return;
    }
    if (this.styles[id] == null) {
      const element = this.createStyleLinkElement();
      this.append(element);
      this.styles[id] = element;
    }
    this.styles[id].setAttribute("href",uri);
  }

  createStyleLinkElement(uri) {
    const element = document.createElement("link");
    element.setAttribute("rel","styleSheet");
    return element;
  }

  getOuterElement() { return this.element; }
  append(...elements) { return this.element.append(...elements); }
}
