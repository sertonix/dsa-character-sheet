function getDisposableFromElement(element) {
  return new DSA.Disposable(() => element.remove());
}

export default {
  addCharacter(character) {
    const element = document.createElement("dsa-character-heading");
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
};
