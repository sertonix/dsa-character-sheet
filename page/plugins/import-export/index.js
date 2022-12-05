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
  const disposables = new DSA.Disposables(
    DSA.getDisposableEventListener( tempInput, "change", () => {
      importFromFileList(tempInput.files);
      disposables.dispose();
    }),
    DSA.getDisposableElement(tempInput),
  );

  tempInput.click();
}

export default {
  // TODO replace with export button
  // addCharacter: character => DSA.getDisposableEventListener( character.topBar.getOuterElement(), "click", () => saveCharacter(character) ),
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
