import { InkscapeSVGConfig, MainConfig } from "../mainConfig/MainConfigSchema";
import { initVectorImageLoader, VectorImageLoader } from "./VectorImageLoader";
import { initPathWrapper, PathWrapper } from "../wrappers/PathWrapper";
import { initFactory, Factory as NodeTreeFactory } from "../motionCanvasNodeTree/factory/Factory";

export type OnChangeCallbackFn = (path: string) => Promise<void>;

export interface VectorImageToMotionCanvasIO {
  readTranslateAndWriteAll(config: MainConfig): Promise<void>;
  getOnChangeCallbackFn(configs: InkscapeSVGConfig[]): OnChangeCallbackFn;
}

export class _VectorImageToMotionCanvasIO
  implements VectorImageToMotionCanvasIO {
  constructor(public deps: {
    pathWrapper: PathWrapper,
    vectorImageLoader: VectorImageLoader,
    motionCanvasNodeTreeFactory: NodeTreeFactory,
  },) {
  }

  async readTranslateAndWriteAll(config: MainConfig):
    Promise<void> {
    for (const svgConfig of config.vectorImages) {
      const inputFilePath = svgConfig.input.filePath;

      const vectorImage = await this.deps.vectorImageLoader.load(inputFilePath);

      const motionCanvasNodeTreeFields = vectorImage.toMotionCanvasNodeTreeFields();
      const motionCanvasNodeTree = this.deps
        .motionCanvasNodeTreeFactory.init(motionCanvasNodeTreeFields);

      await motionCanvasNodeTree.generateOutputFiles(svgConfig);
    }
  }

  getOnChangeCallbackFn(configs: InkscapeSVGConfig[]): OnChangeCallbackFn {
    return async (path: string) => {
      const config = configs
        .find(config => {
          return this.deps.pathWrapper.relative(config.input.filePath, path) == '';
        });

      if (config == null) {
        return;
      }

      const inputFilePath = config.input.filePath;
      const inkscapeSVG = await this.deps.vectorImageLoader.load(inputFilePath);

      const motionCanvasNodeTreeFields = inkscapeSVG.toMotionCanvasNodeTreeFields();
      const newMotionCanvasNodeTree = this.deps
        .motionCanvasNodeTreeFactory.init(motionCanvasNodeTreeFields);

      await newMotionCanvasNodeTree.generateOutputFiles(config);
    };
  }
}

export type InitVectorImageToMotionCanvasIOFn
  = () => VectorImageToMotionCanvasIO;

export const initVectorImageToMotionCanvasIO:
  InitVectorImageToMotionCanvasIOFn = () =>
    new _VectorImageToMotionCanvasIO({
      pathWrapper: initPathWrapper(),
      vectorImageLoader: initVectorImageLoader(),
      motionCanvasNodeTreeFactory: initFactory(),
    });
