import { Scope } from './scope';
import { ScopeType, EvaluateFunc, presetMap, Node } from './types';
import { Stack } from './stack';

export interface ICtx {
  [k: string]: any;
}

export class Path<T extends Node> {
  public visitor!: EvaluateFunc;
  public preset!: presetMap;
  constructor(
    public node: T,
    public parent: Path<Node> | null,
    public scope: Scope,
    public ctx: ICtx,
    public stack: Stack
  ) {}

  public createChild<Child extends Node>(
    node: Child,
    scope?: ScopeType | Scope,
    ctx?: ICtx
  ): Path<Child> {
    const path = new Path(
      node,
      this,
      scope ? (typeof scope === 'number' ? this.scope.createChild(scope) : scope) : this.scope,
      { ...this.ctx, ...ctx },
      this.stack
    );
    path.visitor = this.visitor;
    path.preset = this.preset;
    return path;
  }
}
