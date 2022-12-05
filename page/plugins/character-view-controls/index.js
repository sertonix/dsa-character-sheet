function getRemoveCharacter(character) {
  return () => dsa.removeCharacter(character);
}

function addCloseButton(character) {
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
}

function getViewStateToggle(state,element) {
  return () => {
    if (element.getAttribute("view-state") === state) {
      element.removeAttribute("view-state");
    } else {
      element.setAttribute("view-state",state);
    }
  };
}

function addMaximizeButton(character) {
  const element = document.createElement("dsa-button");
  element.classList.add("dsa-character-maximize");
  element.innerHTML = `\
    <svg version="1.1" viewBox="0 0 100 100">
      <path d="m66.666 100h33.334v-33.334"/>
      <path d="m0 66.666v33.334h33.333"/>
      <path d="m66.666 0h33.334v33.333"/>
      <path d="M 33.333,0 H 0 v 33.333"/>
    </svg>
  `;
  character.topBar.appendToRight(element);

  return new DSA.Disposables(
    DSA.getDisposableEventListener(element, "click", getViewStateToggle("maximized",character.element.main)),
    DSA.getDisposableElement(element),
  );
}

export default {
  addCharacter(character) {
    return new DSA.Disposables(
      addCloseButton(character),
      addMaximizeButton(character),
      // TODO minimize button
    );
  },
  styleURL: "./index.css",
};
