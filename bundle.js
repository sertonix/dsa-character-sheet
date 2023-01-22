const fs = require("node:fs");
const path = require("node:path");

const htmlContent = fs.readFileSync(path.join(__dirname,"page","sheet.html"),{encoding:"utf8"});
const fsJsContent = fs.readFileSync(path.join(__dirname,"page","lib","fs.js"),{encoding:"utf8"});
const libDirPath = path.join(__dirname,"page","lib");
const libFiles = [];
for (const name of fs.readdirSync(libDirPath)) {
  if (name === "fs.js") continue;
  libFiles.push([
    name,
    fs.readFileSync(path.join(libDirPath,name),{encoding:"utf8"}),
  ]);
}

function templateStringify(str) {
  return "`" + str.replace( /[\\`]|\$(?={)/g, "\\$&" ) + "`";
}

const bundledFsJs = fsJsContent.replace(/\/\*! BUNDLER EXCLUDE \*\/[\s\S]*?\/\*! END BUNDLER EXCLUDE \*\//g, () =>
  libFiles.map( ([name,content]) => `vfs.addFileFromContent("/dsa/lib/${name}",${templateStringify(content)});` ).join("\n")
);

const bundledHtmlContent = htmlContent.replace(
  '"./lib/fs.js"',
  () => `URL.createObjectURL(new Blob([${templateStringify(bundledFsJs)}],{type:"text/javascript"}))`,
);

fs.writeFileSync(path.join(__dirname,"sheet-bundled.html"),bundledHtmlContent);
