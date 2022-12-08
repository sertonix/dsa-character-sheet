const SOURCE_URI_PARAMETER_NAME = "source-uri";

const offlinePlugins = {
  "http://localhost:8080/plugins/test/more.js": "console.log('more');",
};

export function importP(uri,base) {
  const resolvedURI = new URL(uri,resolveBaseURI(base));
  const offlineSource = offlinePlugins[resolvedURI];
  if (!offlineSource) return import(resolvedURI);
  return import(`data:application/javascript;charset=utf-8;${SOURCE_URI_PARAMETER_NAME}=${encodeURIComponent(resolvedURI)},${encodeURIComponent(offlineSource)}`);
}

export function resolveBaseURI(uri) {
  if (!uri.startsWith("data:")) return uri;
  const mediaType = base.substring(5).split(",",1)[0];
  const [,...rawParameters] = mediaType.split(";");
  const parameters = rawParameters.map( pair => pair.split("=") );
  for (const [key,value] of parameters) {
    if (key !== SOURCE_URI_PARAMETER_NAME) continue;
    return value;
  }
  return uri;
}
