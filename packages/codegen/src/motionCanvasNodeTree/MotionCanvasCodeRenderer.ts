import { CustomComponentImportPaths } from '../mainConfig/MainConfigSchema';
import { ComponentImportPathsRenderer, initComponentImportPathsRenderer } from './ComponentImportPathsRenderer';
import { JSXComponent } from './node/jsxComponent/JSXComponent';

export interface NodeReference {
	variableName: string;
	// change to limited type that names all the Motion Canvas components
	type: string;
}

export interface OutputFileFields {
	viewAdderFunctionName: string,
	components: JSXComponent[],
	references: NodeReference[],
	customComponentImportPaths: CustomComponentImportPaths,
	outputDirectory: string,
}

export interface MotionCanvasCodeRenderer {
	render(f: OutputFileFields): string;
}

// TODO: create a folder named motionCanvasCodeRenderer 
// and move ./ComponentImportPathsRenderer in there
export class _MotionCanvasCodeRenderer implements MotionCanvasCodeRenderer {
	constructor(public deps: {
		customComponentImportPathsRenderer: ComponentImportPathsRenderer,
	}) { }

	render(f: OutputFileFields): string {
		const customComponentImports = this.deps
			.customComponentImportPathsRenderer
			.renderImports({
				pathsFromProjectRoot: f.customComponentImportPaths,
				renderPathRelativeTo: f.outputDirectory,
				componentsUsed: [...new Set(f.references.map(ref => ref.type))],
			});

		const result = `\
import { Node } from "@motion-canvas/2d";
import { createRef } from "@motion-canvas/core";
${customComponentImports.join('\n')}

export function ${f.viewAdderFunctionName}(node: Node) {
${f.references.map(ref =>
			`	const ${ref.variableName} = createRef<${ref.type}>();`).join('\n')}

	node.add(<>
${f.components.map(comp => comp.toFileContentString('\t', 2)).join('\n')}
	</>);

	return {
${f.references.map(ref => `		${ref.variableName},`).join('\n')}
	};
}
`;
		return result;
	}
}

export type InitMotionCanvasCodeRendererFn = () => MotionCanvasCodeRenderer;

export const initMotionCanvasCodeRenderer = () => new _MotionCanvasCodeRenderer({
	customComponentImportPathsRenderer: initComponentImportPathsRenderer(),
});
