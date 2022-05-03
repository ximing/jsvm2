export function ErrNotDefined(varName: string): ReferenceError {
  return new ReferenceError(`[jsvm] ${varName} is not defined`);
}

export function ErrDuplicateDeclare(varName: string): SyntaxError {
  return new SyntaxError(`[jsvm] Identifier '${varName}' has already been declared`);
}

export function ErrImplement(varName: string): SyntaxError {
  return new SyntaxError(`[jsvm] Not implement for '${varName}' syntax`);
}

export function ErrIsNot(name: string, type: string): TypeError {
  return new TypeError(`[jsvm] ${name} is not ${type}`);
}

export function ErrInvalidIterable(name): TypeError {
  return ErrIsNot(name, 'iterable');
}

export function ErrIsNotFunction(name: string): ReferenceError {
  return new TypeError(`[jsvm] ${name} is not a function`);
}

export function ErrCanNotReadProperty(property: string, target: string): ReferenceError {
  return new TypeError(`[jsvm] Cannot read property '${property}' of ${target}`);
}


export function ErrCanNotSetProperty(
  property: string,
  target: string
): ReferenceError {
  return new TypeError(
    `[jsvm] Cannot set property  '${property}' of ${target}.`
  );
}
