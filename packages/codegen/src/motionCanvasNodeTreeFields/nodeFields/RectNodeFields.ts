import { Position } from '../../utilities/Position';
import { NumericalExpression } from '../../utilities/numericalExpression/NumericalExpression';
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
