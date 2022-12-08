export class URI {
  constructor(components) {
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
    if (this.host == null) return;
    return `${this.userinfo ? `${this.userinfo}@` : ""}${this.host}${this.port ? `:${this.port}` : ""}`;
  }

  isAbsolute() { return !!this.scheme; }
  isRelative() { return !this.scheme; }

  toString() { // TODO add normalization option
    const authority = this.getAuthority();
    return `${
      this.scheme != null ? `${this.scheme}:` : ""
    }${
      authority != null ? `//${authority}` : ""
    }${
      this.path
    }${
      this.query != null ? `?${this.query}` : ""
    }${
      this.fragment != null ? `#${this.fragment}` : ""
    }`;
  }

  static fromString(uri) {
    return new this(this.parse(uri));
  }

  static parse(uri) { // TODO add strict option
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
        parse.userinfo();
        parse.host();
        parse.port();
      },
      userinfo() {
        if (segments[i+1] !== "@") return;
        components.userinfo = segments[i];
        i += 2;
      },
      host() {
        if (parse.ip6()) return;
        let length = segments.slice(i).findIndex( s => ["#","?","/"].includes(s) );
        if (length === -1) length = segments.length - i;
        components.host = segments.slice(i,i + length).join("");
        i += length;
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

  static join(...uris) {
    uris = uris.map( uri => URI.fromString(uri) );
    const lastAbsoluteURIIndex = uris.findLastIndex( uri => uri.isAbsolute() );
    if (lastAbsoluteURIIndex !== -1) uris.splice(0,lastAbsoluteURIIndex);
    const scheme = uris[0]?.scheme;
    const lastURIIndexWithHost = uris.findLastIndex( uri => uri.host != null );
    if (lastURIIndexWithHost !== -1) uris.splice(0,lastURIIndexWithHost);
    const authority = {
      userinfo: uris[0]?.userinfo,
      host: uris[0]?.host,
      port: uris[0]?.port,
    };
    const path = URI.joinPath(...uris.map( uri => uri.path ));
    const lastIndexWithPath = uris.findLastIndex( uri => uri.path );
    if (lastIndexWithPath !== -1) uris.splice(0,lastIndexWithPath);
    return new URI({
      scheme,
      ...authority,
      path,
      query: uris.findLast( uri => uri.query )?.query,
      fragment: uris.findLast( uri => uri.fragment )?.fragment,
    }).toString();
  }

  static joinPath(...paths) {
    paths = paths.filter( path => path !== "" );
    const lastAbsolutePathIndex = paths.findLastIndex( path => path.startsWith("/") );
    if (lastAbsolutePathIndex !== -1) paths.splice(0,lastAbsolutePathIndex);
    const joinedPath = paths.map( (path,i) => i === paths.length - 1 ? path.split("/") : path.split("/").slice(0,-1) ).flat(1).join("/");
    return this.normalizePath(joinedPath);
  }

  static normalizePath(uriPath) {
    const segments = uriPath.split("/");
    for (let i = 0; i < segments.length && segments.length; i++) {
      const segment = segments[i];
      if (segments[i] === ".") {
        segments.splice(i,1);
        i--;
        if (i === segments.length - 1) segments.push("");
      } else if (segments[i] === "..") {
        segments.splice(Math.max(i-1,0),2);
        i -= 2;
        if (i === segments.length - 1) segments.push("");
      }
    }
    if (segments[0] !== "") segments.unshift("");
    return segments.join("/");
  }
}
