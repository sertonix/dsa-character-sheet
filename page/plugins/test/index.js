dsa.buttons.addNew("New Test", () => dsa.addCharacter({
  "title.title": "Test Character",
  "dsa.theme": "dark-minimal",
  "dsa.plugins": [
    "data:application/javascript;charset=utf-8," + encodeURIComponent("console.log('loaded a test plugin in a data uri')"),
  ],
}));
