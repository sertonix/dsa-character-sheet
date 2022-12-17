export default {
  addCharacter(character) {
    const element = document.createElement("dsa-character-title");
    character.config.observe("title.title", title => element.innerText = title );
    character.topBar.appendToMiddle(element);
  },
  configSchema: {
    "title.title": {
      type: "string",
      default: "Character",
    }
  },
  styleURI: "./index.css",
};
