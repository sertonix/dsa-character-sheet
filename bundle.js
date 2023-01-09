const fs = require("node:fs");
const path = require("node:path");

const libFiles = Object.create(null);
const libPath = path.join(__dirname,"page","lib");

// read file content
for (const fileName of fs.readdirSync(libPath)) {
  libFiles[fileName] = fs.readFileSync(path.join(libPath,fileName),{encoding:"utf8"});
}

let htmlContent = fs.readFileSync(path.join(__dirname,"page","sheet.html"),{encoding:"utf8"});

// bundle favicon
const favicon = fs.readFileSync(path.join(__dirname,"page","favicon.svg"),{encoding:"utf8"});
htmlContent = htmlContent.replace("./favicon.svg", "data:image/svg+xml," + encodeURIComponent(favicon) );

// order files so that imports always resolve
const importRegexp = /^import (.+?) from ".\/([a-zA-Z\-_]*?.js)";$/gm;
const orderedLibFiles = [];
let unsortedLibFiles = Object.entries(libFiles);

while (unsortedLibFiles.length) {
  const lengthBefore = unsortedLibFiles.length;
  unsortedLibFiles = unsortedLibFiles.filter( ([name,content]) => {
    if ([...content.matchAll(importRegexp)].some( importMatch =>
      orderedLibFiles.findIndex( ([n]) => n === importMatch[2] ) === -1
    )) return true;
    orderedLibFiles.push([name,content]);
  });
  if (lengthBefore === unsortedLibFiles.length) throw new Error(`circular reference ${unsortedLibFiles.map( ([n]) => n )}`);
}

function genLibFileAdder([name,content]) {
  return `addFile("${name}", genImports\`${
    content
      .replace( /[\\`]|\$(?={)/g, "\\$&" )
      .replace( importRegexp, "import $1 from \"${\"$2\"}\";" )
  }\`);`
}

// bundle javascript
const bundledContent = `
const objectURLs = Object.create(null);

function addFile(name, src) {
  const blob = new Blob(src, {type:"text/javascript"});
  objectURLs[name] = URL.createObjectURL(blob) + "#./" + name;
}

function genImports(strings,...imports) {
  return strings.map( (str,i) =>
    imports.length === i ? str : str + objectURLs[imports[i]]
  );
}

${orderedLibFiles.map(genLibFileAdder).join("\n")}

import(objectURLs["index.js"]);
`;

if (["<!--","<script","</script"].some( s => bundledContent.includes(s) )) {
  throw new Error("can't bundle. please remove any occurences of \"<!--\", \"<script\" or \"</script\"");
}

htmlContent = htmlContent.replace(
  "<script src=\"./lib/index.js\" type=\"module\"></script>",
  () => `<script>${bundledContent}</script>`,
);

fs.writeFileSync(path.join(__dirname,"sheet-bundled.html"),htmlContent);
