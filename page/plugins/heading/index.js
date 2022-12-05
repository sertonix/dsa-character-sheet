function getDisposableFromElement(element) {
  return new DSA.Disposable(() => element.remove());
}

export default {
  addCharacter(character) {
    const element = document.createElement("dsa-character-heading");
    character.data.onDidChange("heading.title", title => element.innerText = title );
    element.innerText = character.data.get("heading.title"); // TODO on title change
    character.topBar.appendToMiddle(element);
    return getDisposableFromElement(element);
  },
  dataSchema: {
    "heading.title": {
      type: "string",
      default: "Character",
    }
  },
  styleURL: "./index.css",
};
