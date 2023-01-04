export class StyleManager {
  styles = new Set();
  element = document.createElement("dsa-style-manager");

  add(uri) {
    const element = this.createStyleLinkElement(uri);
    this.element.append(element);
    this.styles.add(element);
  }

  remove(style) {
    this.styles.remove(style);
  }

  createStyleLinkElement(uri) {
    const element = document.createElement("link");
    element.setAttribute("rel","styleSheet");
    element.setAttribute("href",uri);
    return element;
  }
}
