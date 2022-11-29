const {EventEmitter,createElement,Disposables} = DSA;

export class StyleManager {
  styles = new Set();
  events = new EventEmitter();
  baseURL = new URL("./themes/",import.meta.url);

  constructor(character) {
    this.character = character;
    this.element = createElement("dsa-style-manager",{
      parent: character.element,
    });

    // this.character.data.onDidChange("theme.theme", url => {
    //   const [added,removed] = deltaArrays(newUrls,oldUrls);
    //   this.remove(...removed);
    //   this.addAll(...added);
    // });
    // TODO style changer
    ( style => character.top.addEventListener("click", () => style.setURL(style.url === "black-and-white" ? "dark-minimal" : "black-and-white") ) )(this.addStyle("dark-minimal"));
  }

  addStyle(url) {
    const style = new Style(this,url);
    this.styles.add(style);
    return style;
  }

  removeStyle(styles) {
    this.styles.get(style).dispose();
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
        href: this.getStyleURL(),
      },
      parent: this.styles.element,
    });
  }

  getStyleURL() {
    return this.styles.getStyleURL(this.url);
  }

  setURL(url) {
    this.url = url;
    this.element.setAttribute("href",this.styles.getStyleURL(url));
  }

  dispose() {
    this.element.remove();
  }
}

export const addCharacter = character => new StyleManager(character);
