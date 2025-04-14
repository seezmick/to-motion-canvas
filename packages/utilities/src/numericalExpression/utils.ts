import type { NumericalExpression } from "./NumericalExpression";

export type NumberOrNumericalExpression = NumericalExpression | number;

export function _isNumericalExpression(
  subject: NumberOrNumericalExpression
): subject is NumericalExpression {
  return Number.isNaN(Number(subject));
}

export function _isNumber(
  subject: NumberOrNumericalExpression
): subject is number {
  return !Number.isNaN(Number(subject));
}


export enum Operator {
  Add,
  Subtract,
  Multiply,
  Divide,
  FirstTerm,
}

