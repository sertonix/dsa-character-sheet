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

// bundle javascript
const bundledContent = `\
let objectURLs = Object.create(null);

${orderedLibFiles.map( ([name,content]) =>
  `objectURLs[${JSON.stringify(name)}] = URL.createObjectURL(new Blob([\`${
    content.replace( /[\\`]|\$(?={)/g, "\\$&" ).replace( importRegexp, "import $1 from \"${objectURLs[\"$2\"]}\";" )
  }\`],{type:"text/javascript"})) + "#./" + ${JSON.stringify(name)};`
).join("\n")}

import(objectURLs["index.js"]);`;

if (["<!--","<script","</script"].some( s => bundledContent.includes(s) )) {
  throw new Error("can't bundle. please remove any occurences of \"<!--\", \"<script\" or \"</script\"");
}

htmlContent = htmlContent.replace(
  "<script src=\"./lib/index.js\" type=\"module\"></script>",
  () => `<script>${bundledContent}</script>`,
);

fs.writeFileSync(path.join(__dirname,"sheet-bundled.html"),htmlContent);
