function getDisposableFromElement(element) {
  return new DSA.Disposable(() => element.remove());
}

export default {
  addCharacter(character) {
    const element = document.createElement("dsa-character-title");
    character.data.onDidChange("title.title", title => element.innerText = title );
    element.innerText = character.data.get("title.title");
    character.topBar.appendToMiddle(element);
    return getDisposableFromElement(element);
  },
  dataSchema: {
    "title.title": {
      type: "string",
      default: "Character",
    }
  },
  styleURL: "./index.css",
};
