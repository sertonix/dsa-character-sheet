export default {
  addCharacter(character) {
    const element = document.createElement("dsa-character-title");
    element.innerText = character.data["title.title"];
    character.topBar.appendToMiddle(element);
  },
  styleURI: "./index.css",
};
