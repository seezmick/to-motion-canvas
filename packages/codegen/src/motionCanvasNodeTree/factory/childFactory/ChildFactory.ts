import { NodeFields } from "@to-motion-canvas/utilities";
import { Node } from "../../node/Node";
import { initRectNode, InitRectNode, InitRectNodeArg } from "../../node/rectNode/RectNode";

export interface ChildFactory {
	init(fields: NodeFields): Node;
}

export class _ChildFactory implements ChildFactory {
	constructor(public deps: {
		initRectNodeFn: InitRectNode,
	},) {
	}

	init(fields: NodeFields): Node {
		if (fields.type === 'Rect') {
			return this.deps.initRectNodeFn({
				...fields,
				children: fields.children
					.map(child => this.init(child))
			} satisfies InitRectNodeArg);
		}
		else {
			throw new Error(`Tried to initialize a Motion Canvas Node of unexpected type: ${fields.type}`);
		}
	}
}

export type InitChildFactoryFn = () => ChildFactory;

export const initChildFactory: InitChildFactoryFn
	= () => new _ChildFactory({
		initRectNodeFn: initRectNode,
	});
