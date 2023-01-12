const fs = require("node:fs");
const path = require("node:path");

const htmlContent = fs.readFileSync(path.join(__dirname,"page","sheet.html"),{encoding:"utf8"});
const indexJsContent = fs.readFileSync(path.join(__dirname,"page","lib","index.js"),{encoding:"utf8"});
const libDirPath = path.join(__dirname,"page","lib");
const libFiles = [];
for (const name of fs.readdirSync(libDirPath)) {
  if (name === "index.js") continue;
  libFiles.push([
    name,
    fs.readFileSync(path.join(libDirPath,name),{encoding:"utf8"}),
  ]);
}

function templateStringify(str) {
  return "`" + str.replace( /[\\`]|\$(?={)/g, "\\$&" ) + "`";
}

const bundledIndexJs = indexJsContent.replace(/(?<=\/\*! BUNDLER REPLACE \*\/)[\s\S]*?(?=\/\*! END BUNDLER REPLACE \*\/)/, () =>
  libFiles.map( ([name,content]) => `fileSystem.addFileFromContent("/dsa/lib/${name}",${templateStringify(content)});` ).join("\n")
);

const bundledHtmlContent = htmlContent.replace(
  "<script src=\"./lib/index.js\" type=\"module\"></script>",
  () => `<script>import(URL.createObjectURL(new Blob([${templateStringify(bundledIndexJs)}],{type:"text/javascript"})));</script>`,
);

fs.writeFileSync(path.join(__dirname,"sheet-bundled.html"),bundledHtmlContent);
