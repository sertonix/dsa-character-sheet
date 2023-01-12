const {DataManager} = await fs.i("./data.js",import.meta.url);
const {Sections} = await fs.i("./section.js",import.meta.url);
const {StyleManager} = await fs.i("./style.js",import.meta.url);
const {PluginManager} = await fs.i("./plugin.js",import.meta.url);
const {CommandManager} = await fs.i("./command.js",import.meta.url);

export class Character {
  element = {
    main: document.createElement("dsa-character"),
  };
  sections = new Sections();
  style = new StyleManager();
  plugins = new PluginManager();
  data = new DataManager();
  commands = new CommandManager();

  constructor() {
    for (const pos of ["top","center","bottom"]) {
      const element = document.createElement("dsa-container");
      element.setAttribute("axis","horizontal");
      element.setAttribute("pos",pos);
      this.element.main.append(element);
      this.element[pos === "center" ? "horizontalCenter" : pos] = element;
    }
    for (const pos of ["left","center","right"]) {
      const element = document.createElement("dsa-container");
      element.setAttribute("axis","vertical");
      element.setAttribute("pos",pos);
      this.element.horizontalCenter.append(element);
      this.element[pos] = element;
    }
    
    this.element.center.append(this.sections.element);
    this.element.main.append(this.style.element);
    
    this.commands.add("dsa:about", () => window.open("https://sertonix.github.io/dsa-character-sheet", "_blank")?.focus() );
    this.commands.add("dsa:new", () => window.open(window.location.href, "_blank")?.focus() );
  }

  initialize() {
    this.plugins.initialize();
  }
}
