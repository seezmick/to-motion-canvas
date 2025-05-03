import t from 'tap';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { _MotionCanvasCodeRenderer, OutputFileFields } from './MotionCanvasCodeRenderer';
import { JSXComponent } from './node/jsxComponent/JSXComponent';
import { ComponentImportPathsRenderer } from './ComponentImportPathsRenderer';

t.test('render gives correctly constructed string', t => {
	const jsxComponent1 = Substitute.for<JSXComponent>();
	jsxComponent1
		.toFileContentString('\t', 2)
		.returns(
			`		{/* green-fill-and-stroke-rect-x-long-sharp-corners */}
		<Rect
			ref={greenFillAndStrokeRectXLongSharpCorners}
			width={scaleCoord(82.803673)}
			height={scaleCoord(25.728548)}
			topLeft={[coordX(9.0465326), coordY(10.700179)]}
			fill={'#2ca02c'}
			stroke={'#1300ff'}
			lineWidth={scaleCoord(1.23096)}
		/>`
		);

	const jsxComponent2 = Substitute.for<JSXComponent>();
	jsxComponent2
		.toFileContentString('\t', 2)
		.returns(
			`		{/* red-fill-and-stroke-rect-square-sharp-corners */}
		<Line
			ref={redFillAndStrokeRectSquareSharpCorners}
			width={scaleCoord(81.960045)}
			height={scaleCoord(81.960045)}
			topLeft={[coordX(8.8836927), coordY(78.336815)]}
			fill={'#d40000'}
			stroke={'#1300ff'}
			lineWidth={scaleCoord(1.73211)}
		/>`
		);

	const jsxComponent3 = Substitute.for<JSXComponent>();
	jsxComponent3
		.toFileContentString('\t', 2)
		.returns(
			`		{/* yellow-fill-and-stroke-rect-square-rounded-corners */}
		<Circle
			ref={yellowFillAndStrokeRectSquareRoundedCorners}
			width={scaleCoord(44.620049)}
			height={scaleCoord(44.620049)}
			topLeft={[coordX(7.3198247), coordY(167.9606)]}
			fill={'#ffcc00'}
			stroke={'#1300ff'}
			lineWidth={scaleCoord(0.942981)}
			radius={scaleCoord(10.748698)}
		/>`
		);


	const fields: OutputFileFields = {
		viewAdderFunctionName: 'rects1920By1080',
		customComponentImportPaths: {
			Rect: './src/components/Rect.ts',
		},
		outputDirectory: './src/generatedCode',
		components: [jsxComponent1, jsxComponent2, jsxComponent3,],
		references: [
			{
				variableName: 'greenFillAndStrokeRectXLongSharpCorners',
				type: 'Rect',
			},
			{
				variableName: 'redFillAndStrokeRectSquareSharpCorners',
				type: 'Line',
			},
			{
				variableName: 'yellowFillAndStrokeRectSquareRoundedCorners',
				type: 'Circle',
			},
		],
	};


	const customComponentImportPathsRenderer = Substitute.for<ComponentImportPathsRenderer>();
	customComponentImportPathsRenderer.renderImports({
		pathsFromProjectRoot: {
			Rect: './src/components/Rect.ts',
		},
		renderPathRelativeTo: './src/generatedCode',
		componentsUsed: ['Rect', 'Line', 'Circle'],
	}).returns([
		'import { Circle, Line } from "@motion-canvas/2d";',
		'import { Rect } from "./src/components/Rect.ts";',
	]);


	const motionCanvasCodeRenderer = new _MotionCanvasCodeRenderer({
		customComponentImportPathsRenderer,
	});

	const found = motionCanvasCodeRenderer.render(fields);

	const wanted = `import { Node } from "@motion-canvas/2d";
import { createRef } from "@motion-canvas/core";
import { Circle, Line } from "@motion-canvas/2d";
import { Rect } from "./src/components/Rect.ts";

export function rects1920By1080(node: Node) {
	const greenFillAndStrokeRectXLongSharpCorners = createRef<Rect>();
	const redFillAndStrokeRectSquareSharpCorners = createRef<Line>();
	const yellowFillAndStrokeRectSquareRoundedCorners = createRef<Circle>();

	node.add(<>
		{/* green-fill-and-stroke-rect-x-long-sharp-corners */}
		<Rect
			ref={greenFillAndStrokeRectXLongSharpCorners}
			width={scaleCoord(82.803673)}
			height={scaleCoord(25.728548)}
			topLeft={[coordX(9.0465326), coordY(10.700179)]}
			fill={'#2ca02c'}
			stroke={'#1300ff'}
			lineWidth={scaleCoord(1.23096)}
		/>
		{/* red-fill-and-stroke-rect-square-sharp-corners */}
		<Line
			ref={redFillAndStrokeRectSquareSharpCorners}
			width={scaleCoord(81.960045)}
			height={scaleCoord(81.960045)}
			topLeft={[coordX(8.8836927), coordY(78.336815)]}
			fill={'#d40000'}
			stroke={'#1300ff'}
			lineWidth={scaleCoord(1.73211)}
		/>
		{/* yellow-fill-and-stroke-rect-square-rounded-corners */}
		<Circle
			ref={yellowFillAndStrokeRectSquareRoundedCorners}
			width={scaleCoord(44.620049)}
			height={scaleCoord(44.620049)}
			topLeft={[coordX(7.3198247), coordY(167.9606)]}
			fill={'#ffcc00'}
			stroke={'#1300ff'}
			lineWidth={scaleCoord(0.942981)}
			radius={scaleCoord(10.748698)}
		/>
	</>);

	return {
		greenFillAndStrokeRectXLongSharpCorners,
		redFillAndStrokeRectSquareSharpCorners,
		yellowFillAndStrokeRectSquareRoundedCorners,
	};
}
`;

	// start testing internal calls

	jsxComponent1
		.received()
		.toFileContentString('\t', 2);
	jsxComponent2
		.received()
		.toFileContentString('\t', 2);
	jsxComponent3
		.received()
		.toFileContentString('\t', 2);
	// end testing internal calls

	t.equal(found, wanted);
	t.end();
});
