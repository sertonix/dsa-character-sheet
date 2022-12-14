const CHARACTER_FILE_TYPES = "application/json,.dsa-char";
const DEFAULT_CHARACTER_FILE_ENDING = ".json";
const {safeJSONParse} = await dsa.import("dsa:safe-json-parse");

function saveCharacter(character) {
  const fileContent = character.data.exportString({
    space: character.data.get("import-export.stringify-space"),
  });
  const blob = new Blob([fileContent]);
  const objectURI = URL.createObjectURL(blob);

  const tempLink = document.createElement("a");
  tempLink.setAttribute("href", objectURI);
  tempLink.setAttribute("download", `dsa-character${DEFAULT_CHARACTER_FILE_ENDING}`);
  tempLink.click();

  URL.revokeObjectURL(objectURI);
  tempLink.remove();
}

function importCharacter() {
  const tempInput = document.createElement("input");
  tempInput.setAttribute("type", "file");
  tempInput.setAttribute("multiple", "");
  tempInput.setAttribute("accept", CHARACTER_FILE_TYPES);
  tempInput.addEventListener("change", () => {
    for (const file of tempInput.files) {
      file.text().then( str =>
        dsa.addCharacter(safeJSONParse(str))
      )
    }
  }, {once:true,passive:true});
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
    element.addEventListener("click", getSaveCharacter(character), {passive:true});
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
  styleURI: "./index.css",
};
