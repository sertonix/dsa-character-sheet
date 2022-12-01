import {DSA} from "./dsa.js";

window.DSA = {
  ... await import("./data.js"),
  ... await import("./style.js"),
  ... await import("./theme.js"),
  ... await import("./plugin.js"),
  ... await import("./utils.js"),
  ... await import("./character.js"),
  ... await import("./dsa.js"),
};

const dsa = window.dsa = new DSA();
dsa.initialize();
document.body.append(dsa.getOuterElement());
