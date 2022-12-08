import {URI} from "./uri.js";

export class ThemeManager {
  baseURI = URI.join(import.meta.url,"../themes/");

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
      return URI.join(this.baseURI, uri + "/", "index.css");
    }
    return uri;
  }

  set(uri) {
    this.uri = uri;
    this.theme.setURI(this.resolveURI(this.uri));
  }
}
