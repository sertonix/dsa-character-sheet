const
  logRemoval = url => console.log(`remove plugin: ${JSON.stringify(url)}`),
  logGarbageCollect = url => console.log(`garbage collected plugin: ${JSON.stringify(url)}`),
  getRegisterPlugin = registry => plugin => registry.register(plugin,plugin.url)
  ;

function addToPluginManager(plugins) {
  const disposables = new DSA.Disposables();
  const pluginRegistry = new FinalizationRegistry( logGarbageCollect );
  const register = getRegisterPlugin(pluginRegistry);

  plugins.getAll().map( register );

  disposables.add(
    plugins.onDidAddedPlugin( register ),
    dsa.plugins.onDidRemovedPlugin( logRemoval ),
  );

  return disposables;
}

export default {
  add: () => addToPluginManager(dsa.plugins),
  addCharacter: character => addToPluginManager(character.plugins),
}
