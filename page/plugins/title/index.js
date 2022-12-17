export default {
  addCharacter(character) {
    const element = document.createElement("dsa-character-title");
    character.data.observe("title.title", title => element.innerText = title );
    character.topBar.appendToMiddle(element);
  },
  dataSchema: {
    "title.title": {
      type: "string",
      default: "Character",
    }
  },
  styleURI: "./index.css",
};
