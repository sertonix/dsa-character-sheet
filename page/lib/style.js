export class StyleManager {
  styles = Object.create(null);
  element = document.createElement("dsa-style-manager");

  set(name,uri) {
    if (uri == null) {
      this.styles[name].remove();
      delete this.styles[name];
      return;
    }
    if (this.styles[name] == null) {
      const element = document.createElement("link");
      element.setAttribute("rel","styleSheet");
      this.append(element);
      this.styles[name] = element;
    }
    this.styles[name].setAttribute("href",dsa.resolveURI(uri));
  }

  getOuterElement() { return this.element; }
  append(...elements) { return this.element.append(...elements); }
}
