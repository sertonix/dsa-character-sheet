const {EventEmitter,createElement,Disposables} = DSA;

export class Heading {
  constructor(hero) {
    this.hero = hero;
    this.element = createElement("dsa-hero-heading",{
      parent: this.hero.top,
    });
  }

  dispose() {
    this.element.remove();
  }
}

export const addHero = hero => new Heading(hero);
