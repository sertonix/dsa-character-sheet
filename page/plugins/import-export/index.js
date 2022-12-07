const CHARACTER_FILE_TYPES = "application/json,.dsa-char";
const DEFAULT_CHARACTER_FILE_ENDING = ".json";

function saveCharacter(character) {
  const fileContent = character.exportString({
    space: character.data.get("import-export.stringify-space"),
  });
  const blob = new Blob([fileContent]);
  const objectURL = URL.createObjectURL(blob);

  const tempLink = document.createElement("a");
  tempLink.setAttribute("href", objectURL);
  tempLink.setAttribute("download", `dsa-character${DEFAULT_CHARACTER_FILE_ENDING}`);
  tempLink.click();

  URL.revokeObjectURL(objectURL);
  tempLink.remove();
}

function importFromFileList(files) {
  for (const file of files) {
    file.text().then( str => dsa.addCharacter(JSON.parse(str)) );
  }
}

function importCharacter() {
  const tempInput = document.createElement("input");
  tempInput.setAttribute("type", "file");
  tempInput.setAttribute("multiple", "");
  tempInput.setAttribute("accept", CHARACTER_FILE_TYPES);
  tempInput.once("change", () => importFromFileList(tempInput.files) );
  tempInput.click();
}

function getSaveCharacter(character) {
  return () => saveCharacter(character);
}

export default {
  addCharacter(character) {
    const element = document.createElement("dsa-button");
    element.classList.add("dsa-character-export");
    element.innerText = "Export";
    character.topBar.appendToLeft(element);
    element.addEventListener("click", getSaveCharacter(character));
  },
  add() {
    dsa.buttons.addNew("Import", importCharacter);
  },
  dataSchema: {
    "import-export.stringify-space": {
      type: "integer",
      min: 0,
      default: 2,
    },
  },
};
