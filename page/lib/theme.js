export class ThemeManager {
  baseURL = new URL("../themes/",import.meta.url);

  constructor(character) {
    this.character = character;
  }

  initialize() {
    this.character.data.onDidChange( "dsa.theme", url => this.set(url) );

    this.url = this.character.data.get("dsa.theme");
    this.baseTheme = this.character.style.add(this.resolveURL("base"));
    this.theme = this.character.style.add(this.resolveURL(this.url));
  }

  resolveURL(url) {
    if (/^[a-z]+(?:-[a-z]+)*$/.test(url)) {
      return new URL(url + "/index.css", this.baseURL).toString();
    }
    return url;
  }

  set(url) {
    this.url = url;
    this.theme.setURL(this.resolveURL(this.url));
  }

  dispose() {
    // TODO
  }
}
