import { Context } from './context';
import { ErrDuplicateDeclare } from './error';
import { isolatedScopeMap, ScopeType } from './types';
import { Kind, KindType, Var } from './var';

type ScopeData = {
  [prop: string]: any;
  [prop: number]: any;
};

export class Scope {
  readonly parent: Scope | null;
  readonly data: ScopeData;
  readonly name: string | undefined | symbol;

  public invasive = false; // 变量提升的时候使用
  public context: Context;
  public level = 0;
  public isolated = true; // 函数表达式使用 ,  BlockStatement 做变量提升也需要

  constructor(
    public readonly type: ScopeType,
    parent: Scope | null = null,
    name?: string | symbol
  ) {
    this.name = name;
    this.parent = parent;
    this.data = {};
    this.context = new Context();
  }

  public setContext(context?: Context) {
    if (!context) return;
    this.context = context;
    for (const name in context) {
      if (context.hasOwnProperty(name)) {
        // here should use $var
        this.declareVar(name, context[name]);
      }
    }
  }

  public declare(kind: Kind | KindType, rawName: string, value: any): boolean {
    return {
      [Kind.const]: () => this.declareConst(rawName, value),
      [Kind.let]: () => this.declareLet(rawName, value),
      [Kind.var]: () => this.declareVar(rawName, value),
    }[kind]();
  }

  public declareLet(varName: string, value: any): boolean {
    if (!this.data.hasOwnProperty(varName)) {
      this.data[varName] = new Var(Kind.let, varName, value);
      return true;
    }
    throw ErrDuplicateDeclare(varName);
  }

  public declareConst(varName: string, value: any): boolean {
    if (!this.data.hasOwnProperty(varName)) {
      this.data[varName] = new Var(Kind.const, varName, value);
      return true;
    }
    throw ErrDuplicateDeclare(varName);
  }

  /**
   * Declaring variables with var
   * @param {string} varName
   * @param {*} value
   * @returns {boolean}
   * @memberof Scope
   */
  public declareVar(varName: string, value: any): boolean {
    let targetScope: Scope = this;

    // Hoisting
    // 1. if the current scope is top-level scope
    // 2. if the current scope type is one of types `function`, `constructor`
    while (targetScope.parent !== null && !isolatedScopeMap[targetScope.type]) {
      targetScope = targetScope.parent;
    }

    if (targetScope.data.hasOwnProperty(varName)) {
      const $var = targetScope.data[varName];
      if ($var.kind !== Kind.var) {
        // only cover var with var, not const and let
        throw ErrDuplicateDeclare(varName);
      } else {
        if (targetScope.level === 0 && targetScope.context[varName]) {
          // top level context can not be cover
          // here we do nothing
          // TODO strict mode?
        } else {
          // new var cover the old var
          targetScope.data[varName] = new Var(Kind.var, varName, value);
        }
      }
    } else {
      // set the new var
      targetScope.data[varName] = new Var(Kind.var, varName, value);
    }
    return true;
  }

  /**
   * check the scope have binding a var
   */
  public hasBinding(varName: string): Var<any> | void {
    if (this.data.hasOwnProperty(varName)) {
      return this.data[varName];
    } else if (this.parent) {
      return this.parent.hasBinding(varName);
    } else {
      return undefined;
    }
  }

  /**
   * check scope have binding a var in current scope
   */
  public hasOwnBinding(varName: string): Var<any> | void {
    if (this.data.hasOwnProperty(varName)) {
      return this.data[varName];
    } else {
      return undefined;
    }
  }

  get global(): Scope {
    if (this.parent) {
      return this.parent.global;
    } else {
      return this;
    }
  }

  public createChild(type: ScopeType): Scope {
    const childScope = new Scope(type, this);
    childScope.level = this.level + 1;
    return childScope;
  }

  public fork(type?: ScopeType): Scope {
    // forks a new scope
    const siblingScope = new Scope(type || this.type, this.parent);

    // copy the properties
    siblingScope.invasive = this.invasive;
    siblingScope.level = this.level;
    siblingScope.context = this.context;
    // siblingScope.origin = this;

    // copy the vars
    for (const varName in this.data) {
      if (this.data.hasOwnProperty(varName)) {
        const $var = this.data[varName];
        siblingScope.declare($var.kind, $var.name, $var.value);
      }
    }
    return siblingScope;
  }

  /**
   * Locate a scope with var
   */
  public locate(varName: string): Scope | void {
    if (this.hasOwnBinding(varName)) {
      return this;
    } else {
      if (this.parent) {
        return this.parent.locate.call(this.parent, varName);
      } else {
        return undefined;
      }
    }
  }

  public del(varName: string): boolean {
    if (this.data.hasOwnProperty(varName)) {
      delete this.data[varName];
    }
    return true;
  }
}
