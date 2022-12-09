import {URI} from "./uri.js";

export class URIResolver {
  resolver = Object.create(null);

  set(scheme,resolver) {
    this.resolver[scheme] = resolver;
  }

  resolve(uri) {
    uri = URI.from(uri);
    const resolver = this.resolver[uri.scheme];
    return resolver?.(uri) ?? uri;
  }
}
