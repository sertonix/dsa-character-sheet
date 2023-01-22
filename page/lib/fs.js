export class VirtualFileSystem {
  files = Object.create(null);
  reverse = Object.create(null);
  
  i(...args) { return this.import(...args); }
  
  async import(path,base) {
    return await import(this.getFile(
      base && this.hasPath(base) ?
        this.joinPaths(this.getPath(base),path) :
        path
    ));
  }
  
  addFileFromContent(path, content, type = "text/javascript") {
    this.addFileFromBlob(path,new Blob([content], {type}));
  }
  
  addFileFromBlob(path, blob) {
    this.addFileFromLocalURL(path, URL.createObjectURL(blob));
  }
  
  addFileFromLocalURL(path, url) {
    if (this.files[path]) throw new Error(`file with path ${JSON.stringify(path)} is already registered`);
    if (this.reverse[url]) throw new Error(`file with url ${JSON.stringify(url)} is already registered`);
    this.files[path] = url;
    this.reverse[url] = path;
  }
  
  removeFile(path) {
    const url = this.files[path];
    delete this.files[path];
    delete this.reverse[url];
    URL.revokeObjectURL(url);
  }
  
  hasPath(url) { return !!this.reverse[url]; }
  
  getPath(url) {
    const path = this.reverse[url];
    if (path == null) throw new Error(`file with url ${JSON.stringify(url)} not found`);
    return path;
  }
  
  hasFile(path) { return !!this.files[path]; }
  
  getFile(path) {
    const url = this.files[path];
    if (url == null) throw new Error(`path ${JSON.stringify(path)} not found`);
    return url;
  }
  
  joinPaths(...paths) {
    const absolutePathIndex = paths.findLastIndex( p => p.startsWith("/") );
    if (absolutePathIndex !== -1) paths.splice(0,absolutePathIndex);
    const path = paths.map( path => path.split("/") ).map( (path,i) =>
      path.slice(0, i === paths.length - 1 || path[path.length-1] === ".." ? undefined : -1)
    ).flat(1);
    for (let i = 0; i < path.length; i++) {
      if (path[i] === "..") {
        if (!i) continue;
        path.splice(i-1,2);
        i -= 2;
      } else if (path[i] === ".") {
        path.splice(i,1);
        i--;
      }
    }
    if (absolutePathIndex === -1 && path[0] !== ".." && path[0] !== ".") path.unshift(".");
    return path.join("/");
  }
}

export function init() {
  window.vfs = new VirtualFileSystem();
  vfs.addFileFromLocalURL("/vfs.js",import.meta.url);
/*! BUNDLER EXCLUDE */
  ["character","command","data","index","plugin","section","style"].forEach( name =>
    vfs.addFileFromLocalURL(`/dsa/lib/${name}.js`,new URL(`./${name}.js`,import.meta.url).toString())
  );
/*! END BUNDLER EXCLUDE */
}
