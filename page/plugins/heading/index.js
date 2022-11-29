export function addCharacter(character) {
  const element = document.createElement("dsa-character-heading");
  element.innerText = character.data.get("heading.title"); // TODO on title change
  character.element.top.append(element);
  return { dispose: () => element.remove() };
}

export const dataSchema = {
  "heading.title": {
    type: "string",
    default: "Character",
  }
};
