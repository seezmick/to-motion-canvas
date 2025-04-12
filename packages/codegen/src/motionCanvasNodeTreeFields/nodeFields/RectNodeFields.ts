import { Position } from '@to-motion-canvas/utilities';
import { NumericalExpression } from '@to-motion-canvas/utilities';
import { NodeFields, NodeFieldsWithChildType } from './NodeFields';

export interface RectNodeFieldsWithChildType<T>
  extends NodeFieldsWithChildType<T> {
  width?: NumericalExpression;
  height?: NumericalExpression;
  topLeft?: Position<NumericalExpression>;
  fill?: string;
  stroke?: string;
  lineWidth?: NumericalExpression;
  radius?: NumericalExpression;
}

export interface RectNodeFields
  extends RectNodeFieldsWithChildType<NodeFields[]> { }
