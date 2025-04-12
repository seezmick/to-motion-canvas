import { InkscapeSVGConfig } from '../mainConfig/MainConfigSchema';
import { MotionCanvasNodeTreeFieldsWithChildType } from '../motionCanvasNodeTreeFields/MotionCanvasNodeTreeFields';
import { FsWrapper, initFsWrapper } from '../wrappers/FsWrapper';
import { initMotionCanvasCodeRenderer, MotionCanvasCodeRenderer, OutputFileFields } from './MotionCanvasCodeRenderer';
import { MotionCanvasNodesList } from './MotionCanvasNodesList';

export interface InitMotionCanvasNodeTreeFnArg
	extends MotionCanvasNodeTreeFieldsWithChildType<MotionCanvasNodesList> { }

export interface MotionCanvasNodeTree {
	generateOutputFiles(config: InkscapeSVGConfig): Promise<void>;
}

export class _MotionCanvasNodeTree
	implements MotionCanvasNodeTree, InitMotionCanvasNodeTreeFnArg {
	nodes: MotionCanvasNodesList;
	canvasHeight: number = 0;
	canvasWidth: number = 0;

	constructor(public deps: {
		codeRenderer: MotionCanvasCodeRenderer,
		fs: FsWrapper,
	}, fields: InitMotionCanvasNodeTreeFnArg) {
		Object.assign(this, fields);
		this.nodes = fields.nodes;
	}

	//generate(config: InkscapeSVGConfig): Promise<void> {
	async generateOutputFiles(config: InkscapeSVGConfig): Promise<void> {
		const viewAdderFunctionName
			= config.output.viewAdderFunctionName;

		const {
			jsxComponents,
			references,
		} = this.nodes.getRenderInfo();

		const mainFileCodeContent = this.deps.codeRenderer.render({
			viewAdderFunctionName,
			components: jsxComponents,
			references,
		} satisfies OutputFileFields);

		const outputDirectoryPath = config.output.directoryPath;

		const outputFilePath = `${outputDirectoryPath}/${viewAdderFunctionName}.tsx`;

		await this.deps.fs.writeFile(outputFilePath, mainFileCodeContent);
	}
}

export type InitMotionCanvasNodeTreeFn = (
	fields: InitMotionCanvasNodeTreeFnArg) => MotionCanvasNodeTree;

export const initMotionCanvasNodeTree = (
	fields: InitMotionCanvasNodeTreeFnArg) =>
	new _MotionCanvasNodeTree({
		codeRenderer: initMotionCanvasCodeRenderer(),
		fs: initFsWrapper(),
	}, fields);
