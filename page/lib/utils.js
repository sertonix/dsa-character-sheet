export function deltaArrays(arr1,arr2) {
  arr1 = uniqueArray(arr1);
  arr2 = uniqueArray(arr2);
  return [
    arr1.filter( elem => !arr2.includes(elem) ),
    arr2.filter( elem => !arr1.includes(elem) ),
  ];
}

export function uniqueArray(array) {
  return [...new Set(array)];
}

export function createEmptyObject() {
  // used when the object is used like a Map but only for string keys.
  // it will prevent the default methods like Object.prototype.hasOwnProperty
  return Object.create(null);
}

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
    return new Disposable(() => this.eventTarget.removeEventListener( name, wrappedCallback ) );
  }

  once(name,callback) {
    const wrappedCallback = event => callback(...event);
    this.eventTarget.addEventListener( name, wrappedCallback, {once:true,passive:true} );
    return new Disposable(() => this.eventTarget.removeEventListener( name, wrappedCallback ) );
  }
}

export class Disposable {
  disposed = false;

  constructor(onDispose) {
    if (typeof onDispose !== "function") throw new Error("onDispose is not a function");
    this.onDispose = onDispose;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.onDispose();
    this.onDispose = null;
  }
}

export class Disposables {
  disposed = false;
  disposables = new Set(); // TODO WeakSet
  events = new EventEmitter();

  constructor(...disposables) {
    this.add(...disposables);
  }

  add(...disposables) {
    if (this.disposed) return;
    disposables.forEach( disposable => {
      if (!disposable || !disposable.dispose) throw new Error("not disposable");
      this.disposables.add(disposable);
    });
  }

  mayAdd(...disposables) {
    if (this.disposed) return;
    disposables.forEach( disposable => {
      if (!disposable) return;
      if (!disposable.dispose) throw new Error("not disposable");
      this.disposables.add(disposable);
    });
  }

  remove(...disposables) {
    if (this.disposed) return;
    disposables.forEach( disposable => this.disposables.delete(disposable) );
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.events.emit("dispose");
    this.disposables.forEach( disposable => disposable.dispose() );
    this.disposables = null;
  }

  onDispose(callback) { return this.events.on( "dispose", callback ); }
}

// weak references to arguments
export function getDisposableEventListener(eventTarget,name,callback) {
  eventTarget.addEventListener(name,callback,{passive:true});
  return new Disposable(() => eventTarget.removeEventListener(name,callback));
}

export function getDisposableElement(element) {
  return new Disposable(() => element.remove());
}
