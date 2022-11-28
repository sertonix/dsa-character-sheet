import {Hero} from "./hero.js";
import {DSA} from "./dsa.js";

window.DSA = {
  ... await import("./data.js"),
  ... await import("./plugin.js"),
  ... await import("./utils.js"),
  ... await import("./hero.js"),
  DSA,
};

const dsa = window.dsa = new DSA();
dsa.initialize();
dsa.addHero(new Hero());
