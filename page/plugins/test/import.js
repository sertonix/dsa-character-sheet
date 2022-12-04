const SOURCE_URL_PARAMETER_NAME = "source-url";

const offlinePlugins = {
  "http://localhost:8080/plugins/test/more.js": "console.log('more');",
};

export function importP(url,base) {
  const resolvedUrl = new URL(url,resolveBaseUrl(base));
  const offlineSource = offlinePlugins[resolvedUrl];
  if (!offlineSource) return import(resolvedUrl);
  return import(`data:application/javascript;charset=utf-8;${SOURCE_URL_PARAMETER_NAME}=${encodeURIComponent(resolvedUrl)},${encodeURIComponent(offlineSource)}`);
}

export function resolveBaseUrl(url) {
  if (!url.startsWith("data:")) return url;
  const mediaType = base.substring(5).split(",",1)[0];
  const [,...rawParameters] = mediaType.split(";");
  const parameters = rawParameters.map( pair => pair.split("=") );
  for (const [key,value] of parameters) {
    if (key !== SOURCE_URL_PARAMETER_NAME) continue;
    return value;
  }
  return url;
}
