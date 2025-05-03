import { CustomComponentImportPaths } from '../mainConfig/MainConfigSchema';
import { PathWrapper, initPathWrapper } from '../wrappers/PathWrapper';

export interface RenderImportsFnArg {
	pathsFromProjectRoot: CustomComponentImportPaths,
	renderPathRelativeTo: string,
	componentsUsed: string[],
}

export interface ComponentImportPathsRenderer {
	renderImports(arg: RenderImportsFnArg): string[];
}

export class _ComponentImportPathsRenderer {
	constructor(public deps: {
		pathWrapper: PathWrapper,
	}) { }

	renderImports({
		pathsFromProjectRoot,
		renderPathRelativeTo,
		componentsUsed
	}: RenderImportsFnArg): string[] {
		const customComponentImports = [];
		const motionCanvasComponentsUsed = [];
		for (let [component, path] of Object.entries(pathsFromProjectRoot ?? {})) {
			if (componentsUsed.includes(component)) {
				if (path != null) {
					const importPath = this.deps.pathWrapper
						.relative(renderPathRelativeTo, path);
					customComponentImports.push(`import { ${component} } from "${importPath}";`)
				}
				else {
					motionCanvasComponentsUsed.push(component);
				}
			}
		}
		return [
			...(motionCanvasComponentsUsed.length > 0
				? [`import { ${motionCanvasComponentsUsed.join(', ')} } from "@motion-canvas/2d";`]
				: []),
			...customComponentImports];
	}
}

export type InitComponentImportPathsRendererFn
	= () => ComponentImportPathsRenderer;

export const initComponentImportPathsRenderer
	: InitComponentImportPathsRendererFn
	= () => new _ComponentImportPathsRenderer({
		pathWrapper: initPathWrapper()
	});
