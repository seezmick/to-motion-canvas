import { MotionCanvasNodeTreeFields } from "@to-motion-canvas/utilities";
import { initMotionCanvasNodesList, InitMotionCanvasNodesListFn, } from "../MotionCanvasNodesList";
import { initMotionCanvasNodeTree, InitMotionCanvasNodeTreeFn, MotionCanvasNodeTree } from "../MotionCanvasNodeTree";
import { ChildFactory, initChildFactory } from "./childFactory/ChildFactory";

export interface Factory {
	init(fields: MotionCanvasNodeTreeFields): MotionCanvasNodeTree;
}

export class _Factory implements Factory {

	constructor(public deps: {
		initMotionCanvasNodeTreeFn: InitMotionCanvasNodeTreeFn,
		childFactory: ChildFactory,
		initMotionCanvasNodesListFn: InitMotionCanvasNodesListFn,
	},) {
	}

	init(fields: MotionCanvasNodeTreeFields): MotionCanvasNodeTree {
		const nodes = this.deps.initMotionCanvasNodesListFn(
			fields.nodes.map(nodeFields => this.deps
				.childFactory.init(nodeFields)),);
		return this.deps.initMotionCanvasNodeTreeFn({
			...fields,
			nodes,
		});
	}
}

export type InitFactoryFn = () => Factory;

export const initFactory: InitFactoryFn = () => new _Factory({
	initMotionCanvasNodeTreeFn: initMotionCanvasNodeTree,
	childFactory: initChildFactory(),
	initMotionCanvasNodesListFn: initMotionCanvasNodesList,
});
