import { initNumericalExpression, InitNumericalExpressionFn, NumberOrNumericalExpression, NumericalExpression } from '@to-motion-canvas/utilities';
import { Position } from '@to-motion-canvas/utilities';
import { Options, TransformDefinition } from "../TransformDefinition";

// https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/transform#skewx
export interface SkewXFields {
  skewX: NumberOrNumericalExpression,
}

export class _SkewX implements TransformDefinition {
  skewX: NumberOrNumericalExpression;

  constructor(fields: SkewXFields) {
    this.skewX = fields.skewX;
  }

  applyToPosition(_position: Position<NumericalExpression>): Position<NumericalExpression> {
    throw new Error('TODO: implement');
  }

  applyToScalar(_length: NumericalExpression): NumericalExpression {
    throw new Error('TODO: implement');
  }
}

export type InitSkewXFn
  = (fields: SkewXFields) => TransformDefinition;

export const initSkewX: InitSkewXFn
  = (fields: SkewXFields) => new _SkewX(fields);
