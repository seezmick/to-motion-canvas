import { NodeFields } from '../../motionCanvasNodeTreeFields/nodeFields/NodeFields';

export interface Element {
  // an element may translate to 0 to n (where n>1)
  // nodes
  toMotionCanvasNodesFields(): NodeFields[];
}

export type InitElementType = () => Element;

