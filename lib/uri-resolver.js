import {URI} from "./uri.js";

export class URIResolver {
  resolver = Object.create(null);

  set(scheme,resolver) {
    this.resolver[scheme] = resolver;
  }

  setProxy(scheme,baseURI,ending,name) {
    baseURI = URI.from(baseURI);
    if (name) {
      this.set(scheme, uri => new URI({
        ...baseURI,
        path: URI.joinPath(
          baseURI.path,
          uri.path.indexOf("/") === -1 ?
            URI.joinPath(URI.setEndSlash(uri.path,true), name + ending) :
            uri.path.endsWith(ending) ?
              uri.path :
              uri.path + ending,
        ),
      }));
    } else {
      this.set(scheme, uri => new URI({
        ...baseURI,
        path: URI.joinPath(
          baseURI.path,
          uri.path.endsWith(ending) ?
            uri.path :
            uri.path + ending,
        ),
      }));
    }
  }

  resolve(uri) {
    uri = URI.from(uri);
    const resolver = this.resolver[uri.scheme];
    return resolver?.(uri) ?? uri;
  }
}
