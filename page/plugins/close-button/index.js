function getRemoveCharacter(character) {
  return () => dsa.removeCharacter(character);
}

function getDisposableFromElement(element) {
  return { dispose: () => element.remove() };
}

export function addCharacter(character) {
  const element = document.createElement("dsa-button");
  element.classList.add("dsa-character-close");
  element.addEventListener( "click", getRemoveCharacter(character) );
  character.appendToTop(element);
  return getDisposableFromElement(element);
}
