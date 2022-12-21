// TODO extract to plugin
export class HorizontalBar {
  element = {
    main: document.createElement("dsa-horizontal-bar"),
    left: document.createElement("dsa-horizontal-bar-e"),
    middle: document.createElement("dsa-horizontal-bar-e"),
    right: document.createElement("dsa-horizontal-bar-e"),
  };

  constructor() {
    this.element.left.setAttribute("pos","left");
    this.element.middle.setAttribute("pos","middle");
    this.element.right.setAttribute("pos","right");
    this.append(
      this.element.left,
      this.element.middle,
      this.element.right,
    );
  }

  getOuterElement() { return this.element.main; }
  append(...elements) { this.element.main.append(...elements); }
  appendToLeft(...elements) { this.element.left.append(...elements); }
  appendToMiddle(...elements) { this.element.middle.append(...elements); }
  appendToRight(...elements) { this.element.right.append(...elements); }
}
