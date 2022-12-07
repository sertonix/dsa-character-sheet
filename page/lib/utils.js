export class ArgsLikeEvent extends Event {
  constructor(name,args,options) {
    super(name,options);
    this.args = args;
  }

  [Symbol.iterator]() {
    return this.args[Symbol.iterator]();
  }
}

export class EventEmitter {
  eventTarget = new EventTarget();

  emit(name,...args) {
    this.eventTarget.dispatchEvent(new ArgsLikeEvent(name,args));
  }

  on(name,callback) {
    const wrappedCallback = event => callback(...event);
    this.eventTarget.addEventListener( name, wrappedCallback, {passive:true} );
    return wrappedCallback;
  }

  once(name,callback) {
    const wrappedCallback = event => callback(...event);
    this.eventTarget.addEventListener( name, wrappedCallback, {once:true,passive:true} );
    return wrappedCallback;
  }
}
