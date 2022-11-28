const {Disposables} = DSA;
const disposables = new Disposables();

let pluginRegistry = new FinalizationRegistry( url => console.log(`garbage collected plugin: ${JSON.stringify(url)}`) );
disposables.onDispose( () => "garbage-collector disposed" );

export const files = [
  "./test.js",
];

dsa.plugins.getAll().map( plugin => {
  console.log(plugin.url);
  pluginRegistry?.register(plugin,plugin.url);
});

disposables.add(
  dsa.plugins.onDidAddedPlugin( plugin => {
    console.log(`added ${plugin.url}`);
    pluginRegistry?.register(plugin,plugin.url);
  }),
  dsa.plugins.onDidRemovedPlugin( url => console.log(`remove ${url}`) ),
);


export function dispose() {
  pluginRegistry = undefined;
  disposables.dispose();
}
