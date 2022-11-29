function addToPluginManager(plugins) {
  const disposables = new DSA.Disposables();

  function initialize() {
    function getRegister() {
      const pluginRegistry = new FinalizationRegistry( url => console.log(`garbage collected plugin: ${JSON.stringify(url)}`) );
      return plugin => pluginRegistry.register(plugin,plugin.url);
    }

    const register = getRegister();

    plugins.getAll().map( register );
    disposables.add( plugins.onDidAddedPlugin( register ) );
  }
  initialize();

  disposables.add(
    dsa.plugins.onDidRemovedPlugin( url => console.log(`remove plugin: ${url}`) ),
  );

  return disposables;
}

export function add() {
  return addToPluginManager(dsa.plugins);
}

export function addCharacter(character) {
  return addToPluginManager(character.plugins);
}
