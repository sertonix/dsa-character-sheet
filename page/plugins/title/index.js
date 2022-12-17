export default {
  addCharacter(character) {
    const element = document.createElement("dsa-character-title");
    element.innerText = character.data["title.title"] ?? "Character";
    character.topBar.appendToMiddle(element);
  },
  styleURI: "./index.css",
};
