function getRemoveCharacter(character) {
  return () => dsa.removeCharacter(character);
}

export default {
  addCharacter(character) {
    const element = document.createElement("dsa-button");
    element.classList.add("dsa-character-close");
    element.innerHTML = `\
      <svg version="1.1" viewBox="0 0 100 100">
        <path d="M 0,0 100,100"/>
        <path d="M 100,0 0,100"/>
      </svg>
    `;
    character.topBar.appendToRight(element);

    return new DSA.Disposables(
      DSA.getDisposableEventListener(element, "click", getRemoveCharacter(character)),
      DSA.getDisposableElement(element),
    );
  },
  styleURL: "./index.css",
}
