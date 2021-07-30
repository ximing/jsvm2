import { SourceLocation } from '@babel/types';

export interface IPen {
  stack: string;
  filename: string;
  location: SourceLocation | null;
}

export class Stack {
  private list: string[] = [];
  private items: IPen[] = [];

  constructor(private limitSize: number = Error.stackTraceLimit || 10) {}

  public push(item: IPen) {
    if (this.size > this.limitSize) {
      this.items.shift();
    }
    this.items.push(item);
  }

  public enter(stackName: string) {
    this.list.push(stackName);
  }

  public leave() {
    this.list.pop();
    this.items.pop();
  }

  public get currentStackName(): string {
    return this.list.length ? this.list[this.list.length - 1] : '';
  }

  public peek(): IPen {
    return this.items[this.items.length - 1];
  }

  public isEmpty() {
    return this.items.length === 0;
  }

  public clear() {
    this.items = [];
  }

  public get raw(): string {
    return this.items
      .reverse()
      .map((v) => {
        const meta = `<${v.filename}>:${v.location ? v.location.start.line : '0'}:${
          v.location ? v.location.start.column + 1 : 0 // while + 1 ? because the stack track diffrent with babylon parser
        }`;
        return v.stack ? `at ${v.stack} (${meta})` : `at ${meta}`;
      })
      .map((v) => '    ' + v)
      .join('\n');
  }

  get size() {
    return this.items.length;
  }
}
