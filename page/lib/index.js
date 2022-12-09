import {DSA} from "./dsa.js";

const dsa = window.dsa = new DSA();
dsa.initialize();
document.body.append(dsa.getOuterElement());
