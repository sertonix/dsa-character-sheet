function importSource(src) {
  return import(`data:application/javascript;charset=utf-8,${window.encodeURIComponent( src )}`);
}

function wrapModule(src,globals) {
  return "export default async function({" + globals.join(",") + "}){" + src + "};";
}

async function require(uri) {
  const module = {};
  const globals = {
    module,
    dsa: "dsa",
    require,
    uri,
  };
  const src = await (await fetch(uri)).text();
  const {default:run} = await importSource( wrapModule(src) );
  await run(globals);
  return module.exports;
}

DSA.require = require;

/*
pros:
  better offline storage
  top level return
  custom globals without real globals
  run independent from the mime type a server returns

cons:
  unusual syntax
  can be escaped
  harder to find errors

*/
