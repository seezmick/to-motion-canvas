import { Element } from '../Element';
import { Transformer } from '../../transformer/Transformer';
import {
  initNumericalExpression,
  Position,
  InitNumericaExpressionFn,
  NumericalExpression
} from '@to-motion-canvas/utilities';
import { NodeFields } from '../../../motionCanvasNodeTreeFields/nodeFields/NodeFields';
import { RectNodeFields } from '../../../motionCanvasNodeTreeFields/nodeFields/RectNodeFields';

export interface RectElementFields {
  label?: string;
  id: string;
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  width: number;
  height: number;
  fill: string;
  fillOpacity?: number;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: string;
  strokeLinejoin: string;
  strokeMiterlimit: number;
  strokeDasharray?: string;
  strokeOpacity?: number;
  paintOrder: string;

  children: Element[];
  transformer?: Transformer;
}

export interface RectElement
  extends Element, RectElementFields {
}

export class _RectElement implements RectElement {
  // these defaults are necessary because typescript
  // doesn't play nice with Object.assign
  label?: string;
  id: string = '';
  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  rx?: number;
  ry?: number;
  fill: string = '';
  fillOpacity: number = 0;
  stroke: string = '';
  strokeWidth: number = 0;
  strokeLinecap: string = '';
  strokeLinejoin: string = '';
  strokeMiterlimit: number = 0;
  strokeDasharray?: string = '';
  strokeOpacity?: number = 0;
  paintOrder: string = '';
  children: Element[] = [];
  transformer?: Transformer | undefined;

  constructor(public deps: {
    initNumericalExpressionFn: InitNumericaExpressionFn,
  }, init: RectElementFields) {
    Object.assign(this, init);
  }

  toMotionCanvasNodesFields(): NodeFields[] {
    const pos = ([]: Position<number>): Position<NumericalExpression> => {
      return this.transformer != undefined
        ? this.transformer.applyToPosition([this.x, this.y])
        : [
          this.deps.initNumericalExpressionFn(this.x),
          this.deps.initNumericalExpressionFn(this.y)
        ];
    }

    const scalar = (val?: number): NumericalExpression | undefined => {
      if (val == undefined) return undefined;
      return this.transformer != undefined
        ? this.transformer.applyToScalar(val)
        : this.deps.initNumericalExpressionFn(val);
    }

    const nodeFields: RectNodeFields = {
      refName: this.label ?? this.id,
      type: 'Rect',
      width: scalar(this.width),
      height: scalar(this.height),
      topLeft: pos([this.x, this.y]),
      fill: this.fill,
      stroke: this.stroke,
      lineWidth: scalar(this.strokeWidth),
      ...(this.ry != undefined || this.rx != undefined
        ? { radius: scalar(this.ry) ?? scalar(this.rx) }
        : {}),
      children: this.children.map(child => child.toMotionCanvasNodesFields()).flat(),
    };

    return [nodeFields];
  }

}

export type InitRectElementFn = (init: RectElementFields) => RectElement;

export const initRectElement: InitRectElementFn
  = (init: RectElementFields) => new _RectElement({
    initNumericalExpressionFn: initNumericalExpression,
  }, init);
