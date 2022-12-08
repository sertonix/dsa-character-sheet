const
  logRemoval = uri => console.log(`remove plugin: ${JSON.stringify(uri)}`),
  logGarbageCollect = uri => console.log(`garbage collected plugin: ${JSON.stringify(uri)}`),
  getRegisterPlugin = registry => plugin => registry.register(plugin,plugin.uri)
  ;

function addToPluginManager(plugins) {
  const pluginRegistry = new FinalizationRegistry( logGarbageCollect );
  const register = getRegisterPlugin(pluginRegistry);

  plugins.getAll().map( register );

  plugins.onDidAddedPlugin( register );
  dsa.plugins.onDidRemovedPlugin( logRemoval );
}

export default {
  add: () => addToPluginManager(dsa.plugins),
  addCharacter: character => addToPluginManager(character.plugins),
}
