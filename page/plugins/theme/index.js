const {EventEmitter,createElement,Disposables} = DSA;

export class StyleManager {
  styles = new Set();
  events = new EventEmitter();
  baseURL = new URL("./themes/",import.meta.url);

  constructor(hero) {
    this.hero = hero;
    this.element = createElement("dsa-style-manager",{
      parent: this.hero.element,
    });
    // TODO style changer
    ( style => this.hero.heading.addEventListener("click", () => style.setURL(style.url === "black-and-white" ? "dark-minimal" : "black-and-white") ) )(this.addStyle("dark-minimal"));
  }

  addStyle(url) {
    const style = new Style(this,url);
    this.styles.add(style);
    return style;
  }

  removeStyle(styles) {
    this.styles.delete(styles);
  }

  getStyleURL(url) {
    if (/^[a-z]+(?:-[a-z]+)*$/.test(url)) {
      return new URL(url + "/index.css", this.baseURL).toString();
    }
    return url;
  }

  dispose() {
    this.element.remove();
  }
}

export class Style {
  constructor(styles,url) {
    this.styles = styles;
    this.url = url;
    this.element = createElement("link",{
      attributes: {
        rel: "styleSheet",
        href: this.styles.getStyleURL(url),
      },
      parent: this.styles.element,
    });
  }

  setURL(url) {
    this.url = url;
    this.element.setAttribute("href",this.styles.getStyleURL(url));
  }

  dispose() {
    this.element.remove();
  }
}

export const addHero = hero => new StyleManager(hero);
