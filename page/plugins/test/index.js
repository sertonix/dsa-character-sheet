dsa.buttons.addNew("New Test", () => dsa.addCharacter({
  "heading.title": "Test Character",
  "dsa.theme": "black-and-white",
  "dsa.plugins": [
    "data:application/javascript;charset=utf-8," + encodeURIComponent("console.log('loaded a test plugin in a data uri')"),
  ],
}));
