import { NodeFields } from './nodeFields/NodeFields';

export interface MotionCanvasNodeTreeFieldsWithChildType<T> {
	nodes: T;
	canvasHeight: number,
	canvasWidth: number,
}

export interface MotionCanvasNodeTreeFields
	extends MotionCanvasNodeTreeFieldsWithChildType<NodeFields[]> { }

