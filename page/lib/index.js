const {Character} = await vfs.i("./character.js",import.meta.url);

const dsa = window.dsa = new Character();
document.body.append(dsa.element.main);
dsa.initialize();
