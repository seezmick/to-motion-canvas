import { NumericalExpression } from '@to-motion-canvas/utilities';
import { Position } from '@to-motion-canvas/utilities';

export interface Options {
  dontResolveWhenApplying: boolean
}

export interface TransformDefinition {
  applyToPosition(position: Position<NumericalExpression>): Position<NumericalExpression>;
  applyToScalar(length: NumericalExpression): NumericalExpression;
}

