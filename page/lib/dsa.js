import {EventEmitter} from "./event.js";
import {PluginManager} from "./plugin.js";
import {Character} from "./character.js";
import {StyleManager} from "./style.js";
import {URIResolver} from "./uri-resolver.js";
import {URI} from "./uri.js";

export class DSA {
  character = new Character();
  events = new EventEmitter();
  plugins = new PluginManager();
  style = new StyleManager();
  uriResolver = new URIResolver();

  constructor() {
    this.uriResolver.setProxy("dsa",URI.join(import.meta.url,"."),".js");
    this.uriResolver.setProxy("dsa-plugin",URI.join(import.meta.url,"../plugins/"),".js","index");

    document.body.append(
      this.style.element,
      this.character.element,
    )
  }

  initialize() {
    this.plugins.initialize();
  }

  resolveURI(uri) {
    return this.uriResolver.resolve(uri);
  }

  import(uri) {
    return import(this.resolveURI(uri));
  }
}
