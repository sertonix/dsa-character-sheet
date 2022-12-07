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
