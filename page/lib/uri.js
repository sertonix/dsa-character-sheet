export class URI {
  constructor(components) {
    if (typeof components === "string") components = URI.parse(components);
    ({
      scheme: this.scheme,
      userinfo: this.userinfo,
      host: this.host,
      port: this.port,
      path: this.path,
      query: this.query,
      fragment: this.fragment,
    } = components);
  }

  getAuthority() {
    return `${this.userinfo ? `${this.userinfo}@` : ""}${this.host}${this.port ? `:${this.port}` : ""}`;
  }

  isAbsolute() { return !!this.scheme; }
  isRelative() { return !this.scheme; }

  static fromString(uri) {
    return new URI(URI.parse(uri));
  }

  static parse(uri) {
    const parse = {
      scheme() {
        if (segments[i] === ":") throw new Error("scheme has to be non-empty");
        if (segments[i+1] !== ":") return;
        components.scheme = segments[i];
        if (!/[A-Za-z]/.test(components.scheme[0])) throw new Error(`first character of a scheme has to be a letter not ${JSON.stringify(components.scheme[0])}`);
        for (const c of components.scheme)
          if (!/[A-Za-z0-9+.\-]/.test(c))
            throw new Error(`in the scheme only letters, digits, "+", "." and "-" are allowed and not ${JSON.stringify(c)}`);
        i += 2;
      },
      authority() {
        if (segments[i] !== "/" || segments[i+1] !== "/") return;
        i += 2;
        parse.userInfo();
        parse.host();
        parse.port();
      },
      userInfo() {
        if (segments[i+1] !== "@") return;
        components.userInfo = segments[i];
        i += 2;
      },
      host() {
        if (parse.ip6()) return;
        components.host = segments[i];
        i++;
      },
      ip6() {
        if (segments[i] !== "[") return;
        const length = segments.slice(i).indexOf("]") + 1; // TODO replace with while loop for better errors and better validation
        if (length === 0) throw new Error("ip6 bracket is not closed");
        components.host = segments.slice(i,i + length).join("");
        i += length;
        return true;
      },
      port() {
        if (segments[i] !== ":") return;
        i++;
        if (["#","?","/"].includes(segments[i])) {
          components.port = "";
        } else {
          components.port = segments[i];
          for (let j = 0; j < components.port.length; j++) {
            if (!/[0-9]/.test(components.port[j])) throw new Error(`invalid character ${JSON.stringify(components.port[j])} at index ${i+j}. port has to be a decimal number`);
          }
          i++;
        }
      },
      path() {
        if (["#","?"].includes(segments[i])) return components.path = "";
        let length = segments.slice(i).findIndex( s => ["#","?"].includes(s) );
        if (length === -1) length = segments.length - i;
        components.path = segments.slice(i,i + length).join("");
        i += length;
      },
      query() {
        if (segments[i] !== "?") return;
        i++;
        let length = segments.slice(i).indexOf("#");
        if (length === -1) length = segments.length - i;
        components.query = segments.slice(i,i + length).join("");
        i += length;
      },
      fragment() {
        if (segments[i] !== "#") return;
        components.fragment = segments.splice(i+1).join("");
        i = segments.length;
      },
    };

    for (let i = 0; i < uri.length; i++) {
      if (uri[i] === "%") {
        if (!/[0-9a-fA-F]{2}/.test(uri.substring(i,i+2))) throw new Error(`invalid percent escape sequence at index ${i} in ${JSON.stringify(uri)}`);
        i += 2;
      } else if (!/[!#$&-;=?-[\]_a-z~]/.test(uri[i])) {
        throw new Error(`invalid character ${JSON.stringify(uri[i])} in uri at index ${i}`);
      }
    }
    const segments = uri.split(/(?<=[:/?#\[\]@])|(?=[:/?#\[\]@])/g); // split reserved characters and groups of other characters
    const components = {};
    let i = 0;

    parse.scheme();
    parse.authority();
    parse.path();
    parse.query();
    parse.fragment();

    if (i !== segments.length) throw new Error("didn't finished parsing of uri");

    return components;
  }

  static join(uri1,uri2) {
    uri1 = new URI(uri1);
    uri2 = new URI(uri2);
    if (uri2.isAbsolute()) return new URI(uri2);
    if (uri2.host) return new URI({
      ...uri2,
      scheme: uri1.scheme,
    });
    return new URI({
      scheme: uri1.scheme,
      userinfo: uri1.userinfo,
      host: uri1.host,
      port: uri1.port,
      path: URI.joinPath(uri1.path,uri2.path),
      query: uri2.query ?? uri1.query,
      fragment: uri2.fragment ?? uri1.fragment,
    });
  }

  static joinPath(uriPath1,uriPath2) {
    if (uriPath2[0] === "/") return uriPath2;
    const joinedPath = ( uriPath1.endsWith("/") ? uriPath1 : uriPath1.split("/").slice(0,-1).join("/") + "/" ) + uriPath2;
    return URI.normalizePath(joinedPath);
  }

    return uriPath;
    // TODO resolve uri path
  static normalizePath(uriPath) {
  }
}
