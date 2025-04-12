import t from 'tap';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { InitRectNode, RectNode, InitRectNodeArg } from "../../node/rectNode/RectNode";
import { _ChildFactory } from "./ChildFactory";
import { RectNodeFields } from '../../../motionCanvasNodeTreeFields/nodeFields/RectNodeFields';
import { NumericalExpression } from '@to-motion-canvas/utilities';

t.test('init works', t => {
	interface InitRectNodeJacket {
		fn: InitRectNode,
	}
	const initRectNodeJacket = Substitute.for<InitRectNodeJacket>();

	const fields: RectNodeFields = {
		refName: "green-fill-and-stroke-rect-x-long-sharp-corners",
		type: 'Rect',
		width: Substitute.for<NumericalExpression>(),
		height: Substitute.for<NumericalExpression>(),
		topLeft: [Substitute.for<NumericalExpression>(),
		Substitute.for<NumericalExpression>()],
		fill: "#2ca02c",
		stroke: "#1300ff",
		lineWidth: Substitute.for<NumericalExpression>(),
		children: [
			{
				refName: "SecondRect",
				type: 'Rect',
				children: [],
			},
			{
				refName: "random-reference",
				type: 'Rect',
				width: Substitute.for<NumericalExpression>(),
				height: Substitute.for<NumericalExpression>(),
				topLeft: [Substitute.for<NumericalExpression>(),
				Substitute.for<NumericalExpression>()],
				fill: "#111111",
				stroke: "#fffff",
				lineWidth: Substitute.for<NumericalExpression>(),
				children: [{
					refName: "Grand-child",
					type: 'Rect',
					children: [],
				},],
			} as RectNodeFields
		],
	}

	const nodeInitializedNumber1 = Substitute.for<RectNode>();
	const nodeInitializedNumber2 = Substitute.for<RectNode>();
	const nodeInitializedNumber3 = Substitute.for<RectNode>();
	const nodeInitializedNumber4 = Substitute.for<RectNode>();

	initRectNodeJacket
		.fn(
			fields // "green-fill-and-stroke-rect-x-long-sharp-corners",
				.children[1] // "random-reference",
				.children[0] as any as InitRectNodeArg // "Grand-child",
		)
		.returns(nodeInitializedNumber1);

	initRectNodeJacket
		.fn({
			...fields // "green-fill-and-stroke-rect-x-long-sharp-corners",
				.children[1], // "random-reference",
			children: [nodeInitializedNumber1],
		})
		.returns(nodeInitializedNumber2);

	initRectNodeJacket
		.fn({
			...fields // "green-fill-and-stroke-rect-x-long-sharp-corners",
				.children[0], // "SecondRect"
			children: [],
		})
		.returns(nodeInitializedNumber3);

	initRectNodeJacket
		.fn({
			...fields, // "green-fill-and-stroke-rect-x-long-sharp-corners",
			children: [
				nodeInitializedNumber3,
				nodeInitializedNumber2],
		})
		.returns(nodeInitializedNumber4);


	const childFactory = new _ChildFactory({
		initRectNodeFn: initRectNodeJacket.fn,
	});

	const wanted = childFactory.init(fields);
	const found = nodeInitializedNumber4;

	// start testing internal calls


	initRectNodeJacket
		.received()
		.fn(
			fields // "green-fill-and-stroke-rect-x-long-sharp-corners",
				.children[1] // "random-reference",
				.children[0] as any as InitRectNodeArg // "Grand-child",
		);

	initRectNodeJacket
		.received()
		.fn({
			...fields // "green-fill-and-stroke-rect-x-long-sharp-corners",
				.children[1], // "random-reference",
			children: [nodeInitializedNumber1],
		});

	initRectNodeJacket
		.received()
		.fn({
			...fields // "green-fill-and-stroke-rect-x-long-sharp-corners",
				.children[0], // "SecondRect"
			children: [],
		});

	initRectNodeJacket
		.received()
		.fn({
			...fields, // "green-fill-and-stroke-rect-x-long-sharp-corners",
			children: [
				nodeInitializedNumber3,
				nodeInitializedNumber2],
		});


	// end testing internal calls

	t.equal(wanted, found);
	t.end();
});
