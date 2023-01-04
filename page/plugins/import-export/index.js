const CHARACTER_FILE_TYPES = "application/json,.dsa-char";
const DEFAULT_CHARACTER_FILE_ENDING = ".json";

function saveCharacter() {
  const fileContent = JSON.stringify(
    dsa.character.export(),
    null,
    dsa.character.config.get("import-export.stringify-space")
  );
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
      file.text().then( dsa.addCharacter.bind(dsa) )
    }
  }, {once:true,passive:true});
  tempInput.click();
}

export default {
  add() {
    const importB = document.createElement("dsa-button");
    importB.classList.add("dsa-character-export");
    importB.innerText = "Import";
    dsa.character.topBar.appendToLeft(importB);
    importB.addEventListener("click", importCharacter, {passive:true});

    const exportB = document.createElement("dsa-button");
    exportB.classList.add("dsa-character-export");
    exportB.innerText = "Export";
    dsa.character.topBar.appendToLeft(exportB);
    exportB.addEventListener("click", saveCharacter, {passive:true});
  },
  configSchema: {
    "import-export.stringify-space": {
      type: "integer",
      min: 0,
      default: 2,
    },
  },
  styleURI: "./index.css",
};
