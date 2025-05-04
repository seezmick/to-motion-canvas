import { PossibleSpacing, PossibleVector2, SignalValue } from '@motion-canvas/core';
import { Position } from '../../Position';
import { NumericalExpression } from '../../numericalExpression/NumericalExpression';
import { NodeFields, NodeFieldsWithChildType } from './NodeFields';
import { Length, LengthLimit, RectProps } from '@motion-canvas/2d';

type MyLength = NumericalExpression | `${number}%`;

type ChangeFieldTypesAdvanced<T> = {
  [K in keyof T]: T[K] extends SignalValue<infer U>
  ? (U extends PossibleSpacing
    ? NumericalExpression
    : U extends number
    ? NumericalExpression
    : U extends Length
    ? MyLength
    : U extends LengthLimit
    ? MyLength | null | 'max-content' | 'min-content'
    : U extends PossibleVector2
    ? Position<NumericalExpression>
    : U extends PossibleVector2<Length>
    ? Position<NumericalExpression>
    : U)
  : T[K];
};

export interface RectNodeFieldsWithChildType<T>
  //extends NodeFieldsWithChildType<T> {
  //width?: NumericalExpression;
  //height?: NumericalExpression;
  //topLeft?: Position<NumericalExpression>;
  //fill?: string;
  //stroke?: string;
  //lineWidth?: NumericalExpression;
  //radius?: NumericalExpression;

  extends NodeFieldsWithChildType<T>, ChangeFieldTypesAdvanced<Omit<RectProps, "children" | "ref">> {
}

export interface RectNodeFields
  extends RectNodeFieldsWithChildType<NodeFields[]> { }
