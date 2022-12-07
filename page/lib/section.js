export class Sections {
  types = Object.create(null);
  sections = new Set();
  element = document.createElement("dsa-character-sections");

  add(type,options) {
    const section = new Section(this,type,options);
    this.sections.add(section);
    this.append(section.getOuterElement());
    return section;
  }

  remove(section) {
    this.sections.delete(section);
    this.removeChild(section.getOuterElement());
  }

  registerType(name,Class) {
    if (this.types[name]) throw new Error("section type already exists");
    this.types[name] = Class;
  }

  append(...elements) { this.element.append(...elements); }
  getOuterElement() { return this.element; }
  removeChild(child) { this.element.removeChild(child); }
}

export class Section {
  element = document.createElement("dsa-character-section");

  constructor(sections,type,options) {
    this.sections = sections;
    this.type = type;
    this.options = options;
    this.instance = new this.sections.types[type](this,options)
  }

  getOuterElement() { return this.element; }

  append(...elements) {
    return this.element.append(...elements);
  }
}

/*
TODO await if type is not registered yet
Selections.awaitType(type)
Selection.awaitType = this.selections.awaitType(type).then(type => this.instance = new type(this))
*/
