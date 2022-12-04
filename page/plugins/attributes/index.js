const ATTRIBUTES = [ // TODO api to change attributes
  ["~M~ut","red"],
  ["~K~lugheit","purple"],
  ["~I~ntuition","green"],
  ["~C~harisma","#151515"], // TODO fix black on black in the theme
  ["~Finger~fertigkeit","yellow"],
  ["~G~ewandheit","blue"],
  ["~K~onstitution","white"],
  ["~Körper~kraft","orange"],
];

export class Attributes {
  attributes = new Set();
  element = document.createElement("dsa-attributes");

  constructor(section) {
    this.section = section;
    this.section.append(this.getOuterElement());

    for (const [name,color] of ATTRIBUTES) {
      this.addNew({name,color});
    }
  }

  addNew(options) {
    const attribute = new Attribute(options);
    this.add(attribute);
    return attribute;
  }

  add(attribute) {
    this.append(attribute.getOuterElement());
  }

  append(...elements) { this.element.append(...elements); }
  getOuterElement() { return this.element; }
  removeChild(child) { this.element.removeChild(child); }

  dispose() {
    // TODO
  }
}

export class Attribute {
  element = document.createElement("dsa-attribute");

  constructor({
    name,
    value = 8,
    color = [],
  }) {
    this.color = color;
    this.name = new AttributeName(name.replace(/~/g,""));
    this.value = new AttributeValue(value);
    this.abbreviation = new AttributeAbbreviation(name.replace(/(?<!~)./g,"").toUpperCase());

    this.append(
      this.abbreviation.getOuterElement(),
      this.name.getOuterElement(),
      this.value.getOuterElement(),
    );

    this.element.style.setProperty("--dsa-attribute-color",color);
  }

  append(...elements) { this.element.append(...elements); }
  getOuterElement() { return this.element; }

  dispose() {
    this.name.dispose();
    this.value.dispose();
    this.abbreviation.dispose();

    this.element.remove();
  }
}

export class AttributeValue {
  element = document.createElement("dsa-attribute-value");

  constructor(value) {
    this.value = value;
    this.element.innerText = value;
  }

  set(value) {
    this.value = value;
    this.element.innerText = value;
  }

  append(...elements) { this.element.append(...elements); }
  getOuterElement() { return this.element; }

  dispose() {
    this.element.remove();
  }
}

export class AttributeName {
  element = document.createElement("dsa-attribute-name");

  constructor(name) {
    this.name = name;
    this.element.innerText = name;
  }

  set(name) {
    this.name = name;
    this.element.innerText = name;
  }

  append(...elements) { this.element.append(...elements); }
  getOuterElement() { return this.element; }

  dispose() {
    this.element.remove();
  }
}

export class AttributeAbbreviation {
  element = document.createElement("dsa-attribute-abbreviation");

  constructor(abbreviation) {
    this.abbreviation = abbreviation;
    this.element.innerText = abbreviation;
  }

  set(abbreviation) {
    this.abbreviation = abbreviation;
    this.element.innerText = abbreviation;
  }

  append(...elements) { this.element.append(...elements); }
  getOuterElement() { return this.element; }

  dispose() {
    this.element.remove();
  }
}

export default {
  addCharacter(character) {
    character.sections.registerType("attributes",Attributes);
    return character.sections.add("attributes");
  },
  styleURL: "./index.css",
};
