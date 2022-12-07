function safeObject(k,v) {
  return v && typeof v === "object" && !Array.isArray(v) ? Object.setPrototypeOf(v, null) : v;
}

export function safeJSONParse(str) { // TODO allow reviver
  return JSON.parse(str,safeObject);
}
