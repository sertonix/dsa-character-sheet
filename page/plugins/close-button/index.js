export function addCharacter(character) {
  const element = document.createElement("dsa-button");
  element.classList.add("dsa-character-close");
  element.addEventListener( "click", () => dsa.removeCharacter(character) );
  character.element.top.append(element);
  return { dispose: () => element.remove() };
}
