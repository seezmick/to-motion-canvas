import { NodeFields } from '../../../motionCanvasNodeTreeFields/nodeFields/NodeFields';
import { RectNodeFields } from '../../../motionCanvasNodeTreeFields/nodeFields/RectNodeFields';
import { Element } from '../Element';

export interface GroupElementFields {
  id: string;
  children: Element[];
}

//https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/g
// TODO: implement that "its attributes are inherited by its children"
export interface GroupElement
  extends Element, GroupElementFields {
}

export class _GroupElement implements GroupElement {
  // these defaults are necessary because typescript
  // doesn't play nice with Object.assign
  id: string = '';
  children: Element[] = [];

  constructor(public deps: {
  }, init: GroupElementFields) {
    Object.assign(this, init);
  }

  toMotionCanvasNodesFields(): NodeFields[] {
    return [{
      refName: this.id,
      type: 'Rect',
      children: this.children.map(child => child.toMotionCanvasNodesFields()).flat(),
    } satisfies RectNodeFields];
  }

}

export type InitGroupElementFn = (init: GroupElementFields) => GroupElement;

export const initGroupElement: InitGroupElementFn
  = (init: GroupElementFields) => new _GroupElement({
  }, init);
