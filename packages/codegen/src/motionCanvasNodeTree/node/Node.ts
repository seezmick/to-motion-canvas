import { NodeReference } from '../MotionCanvasCodeRenderer';
import { JSXComponent } from './jsxComponent/JSXComponent';

export interface Node {
  toJSXComponent(): JSXComponent;
  getReferences(): NodeReference[];
}
