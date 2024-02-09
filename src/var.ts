export enum Kind {
  var = 'var',
  let = 'let',
  const = 'const',
}

export type KindType = "var" | "let" | "const" | "using" | "await using";

export class Var<T = any> {
  constructor(public kind: Kind | KindType, public name: string, private val: T) {}

  get value() {
    return this.val;
  }

  set value(val: T) {
    this.val = val;
  }
}
