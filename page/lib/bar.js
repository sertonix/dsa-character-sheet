export class HorizontalBar {
  element = {
    main: document.createElement("dsa-horizontal-bar"),
    left: document.createElement("dsa-horizontal-bar-left"),
    middle: document.createElement("dsa-horizontal-bar-middle"),
    right: document.createElement("dsa-horizontal-bar-right"),
  };

  constructor() {
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

  dispose() {
    this.element.main.remove();
    this.element.left.remove();
    this.element.middle.remove();
    this.element.right.remove();
  }
}
