import {DSA} from "./dsa.js";

window.DSA = {
  ... await import("./bar.js"),
  ... await import("./button.js"),
  ... await import("./character.js"),
  ... await import("./data-schema.js"),
  ... await import("./data.js"),
  ... await import("./dsa.js"),
  ... await import("./plugin.js"),
  ... await import("./style.js"),
  ... await import("./theme.js"),
  ... await import("./utils.js"),
};

const dsa = window.dsa = new DSA();
dsa.initialize();
document.body.append(dsa.getOuterElement());
