import { MotionCanvasNodeTreeFields } from '../motionCanvasNodeTreeFields/MotionCanvasNodeTreeFields';
import { Element as InkscapeSVGElement } from './element/Element';

export interface ViewBox {
  minX: number;
  minY: number;
  height: number;
  width: number;
}

export interface InkscapeSVGFields {
  elements: InkscapeSVGElement[];
  width: number;
  height: number;
  viewBox: ViewBox;
}

export interface InkscapeSVG extends InkscapeSVGFields {
  toMotionCanvasNodeTreeFields(): MotionCanvasNodeTreeFields;
}

export class _InkscapeSVG implements InkscapeSVG {
  // these defaults are necessary because typescript
  // doesn't play nice with Object.assign
  elements: InkscapeSVGElement[] = [];
  width: number = 0;
  height: number = 0;
  viewBox: ViewBox = {
    minX: 0, minY: 0,
    height: 0, width: 0,
  };

  constructor(
    public deps: {
    },
    init: InkscapeSVGFields) {
    Object.assign(this, init);
  }

  toMotionCanvasNodeTreeFields(): MotionCanvasNodeTreeFields {
    return {
      nodes: this.elements.map(elem => elem.toMotionCanvasNodesFields()).flat(),
      canvasHeight: this.height,
      canvasWidth: this.width,
    };
  }
}

export type InitInkscapeSVGFn = (
  init: InkscapeSVGFields) => InkscapeSVG;

export const initInkscapeSVG: InitInkscapeSVGFn
  = (init: InkscapeSVGFields) =>
    new _InkscapeSVG({
    }, init);

