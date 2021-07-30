export function ErrNotDefined(varName: string): ReferenceError {
  return new ReferenceError(`${varName} is not defined`);
}

export function ErrDuplicateDeclare(varName: string): SyntaxError {
  return new SyntaxError(`Identifier '${varName}' has already been declared`);
}

export function ErrImplement(varName: string): SyntaxError {
  return new SyntaxError(`Not implement for '${varName}' syntax`);
}

export function ErrIsNot(name: string, type: string): TypeError {
  return new TypeError(`${name} is not ${type}`);
}

export function ErrInvalidIterable(name): TypeError {
  return ErrIsNot(name, 'iterable');
}

export function ErrIsNotFunction(name: string): ReferenceError {
  return new TypeError(`${name} is not a function`);
}

export function ErrCanNotReadProperty(property: string, target: string): ReferenceError {
  return new TypeError(`Cannot read property '${property}' of ${target}`);
}
