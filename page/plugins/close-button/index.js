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
  element.innerHTML = `\
    <svg version="1.1" viewBox="0 0 100 100">
      <path d="M 0,0 100,100"/>
      <path d="M 100,0 0,100"/>
    </svg>
  `;
  character.appendToTop(element);
  return getDisposableFromElement(element);
}

export const styleURL = "./index.css";
