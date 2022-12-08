export class ThemeManager {
  baseURI = new URL("../themes/",import.meta.url);

  constructor(character) {
    this.character = character;
  }

  initialize() {
    this.character.data.onDidChange( "dsa.theme", uri => this.set(uri) );

    this.uri = this.character.data.get("dsa.theme");
    this.baseTheme = this.character.style.add(this.resolveURI("base"));
    this.theme = this.character.style.add(this.resolveURI(this.uri));
  }

  resolveURI(uri) {
    if (/^[a-z]+(?:-[a-z]+)*$/.test(uri)) {
      return new URL(uri + "/index.css", this.baseURI).toString();
    }
    return uri;
  }

  set(uri) {
    this.uri = uri;
    this.theme.setURI(this.resolveURI(this.uri));
  }
}
