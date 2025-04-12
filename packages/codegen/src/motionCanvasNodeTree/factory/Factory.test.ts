import t from 'tap';
import { Arg, Substitute, SubstituteOf } from '@fluffy-spoon/substitute';
import { InitMotionCanvasNodesListFn, MotionCanvasNodesList, } from "../MotionCanvasNodesList";
import { InitMotionCanvasNodeTreeFn, MotionCanvasNodeTree } from "../MotionCanvasNodeTree";
import { ChildFactory } from "./childFactory/ChildFactory";
import { _Factory } from "./Factory";
import { MotionCanvasNodeTreeFields } from '../../motionCanvasNodeTreeFields/MotionCanvasNodeTreeFields';
import { NumericalExpression } from '@to-motion-canvas/utilities';
import { RectNodeFields } from '../../motionCanvasNodeTreeFields/nodeFields/RectNodeFields';
import { Node } from '../node/Node';

t.test('init works', t => {
	// start preparing children

	const fieldsNode1: RectNodeFields = {
		refName: "green-fill-and-stroke-rect-x-long-sharp-corners",
		type: 'Rect',
		width: Substitute.for<NumericalExpression>(),
		height: Substitute.for<NumericalExpression>(),
		topLeft: [Substitute.for<NumericalExpression>(),
		Substitute.for<NumericalExpression>()],
		fill: "#2ca02c",
		stroke: "#1300ff",
		lineWidth: Substitute.for<NumericalExpression>(),
		children: [],
	};
	const childNode1 = Substitute.for<Node>();

	const fieldsNode2: RectNodeFields = {
		refName: "SecondRect",
		type: 'Rect',
		children: [],
	};
	const childNode2 = Substitute.for<Node>();

	const fieldsNode3: RectNodeFields = {
		refName: "random-reference",
		type: 'Rect',
		width: Substitute.for<NumericalExpression>(),
		height: Substitute.for<NumericalExpression>(),
		topLeft: [Substitute.for<NumericalExpression>(),
		Substitute.for<NumericalExpression>()],
		fill: "#111111",
		stroke: "#fffff",
		lineWidth: Substitute.for<NumericalExpression>(),
		children: [],
	};
	const childNode3 = Substitute.for<Node>();

	// end preparing children

	const childFactory = Substitute.for<ChildFactory>();
	childFactory
		.init(fieldsNode1)
		.returns(childNode1);
	childFactory
		.init(fieldsNode2)
		.returns(childNode2);
	childFactory
		.init(fieldsNode3)
		.returns(childNode3);


	interface InitMotionCanvasNodesListFnJacket {
		fn: InitMotionCanvasNodesListFn
	}
	const initMotionCanvasNodesListFnJacket
		= Substitute.for<InitMotionCanvasNodesListFnJacket>();
	const nodesList = Substitute.for<MotionCanvasNodesList>();

	initMotionCanvasNodesListFnJacket
		.fn([childNode1, childNode2, childNode3])
		.returns(nodesList);


	interface InitMotionCanvasNodeTreeFnJacket {
		fn: InitMotionCanvasNodeTreeFn
	}
	const initMotionCanvasNodeTreeFnJacket
		= Substitute.for<InitMotionCanvasNodeTreeFnJacket>();


	const motionCanvasNodeTree: MotionCanvasNodeTree
		= Substitute.for<MotionCanvasNodeTree>();
	const sourceFields: MotionCanvasNodeTreeFields = {
		nodes: [fieldsNode1, fieldsNode2, fieldsNode3],
		canvasHeight: 4812,
		canvasWidth: 1802,
	};


	initMotionCanvasNodeTreeFnJacket
		.fn({
			canvasHeight: sourceFields.canvasHeight,
			canvasWidth: sourceFields.canvasWidth,
			nodes: nodesList,
		})
		.returns(motionCanvasNodeTree);

	const factory = new _Factory({
		initMotionCanvasNodeTreeFn: initMotionCanvasNodeTreeFnJacket.fn,
		childFactory,
		initMotionCanvasNodesListFn: initMotionCanvasNodesListFnJacket.fn,
	});

	const found = factory.init(sourceFields);
	const wanted = motionCanvasNodeTree;

	// start testing internal calls

	childFactory
		.received()
		.init(fieldsNode1)
	childFactory
		.received()
		.init(fieldsNode2)
	childFactory
		.received()
		.init(fieldsNode3)

	initMotionCanvasNodesListFnJacket
		.received()
		.fn([childNode1, childNode2, childNode3]);

	initMotionCanvasNodeTreeFnJacket
		.received()
		.fn({
			canvasHeight: sourceFields.canvasHeight,
			canvasWidth: sourceFields.canvasWidth,
			nodes: nodesList,
		});

	// end testing internal calls

	t.equal(found, wanted);
	t.end();
});
