const
  logRemoval = url => console.log(`remove plugin: ${JSON.stringify(url)}`),
  logGarbageCollect = url => console.log(`garbage collected plugin: ${JSON.stringify(url)}`),
  getRegisterPlugin = registry => plugin => registry.register(plugin,plugin.url)
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
