import { InkscapeSVGConfig, MainConfig } from "../mainConfig/MainConfigSchema";
import { initInkscapeSVGLoader, InkscapeSVGLoader } from "@to-motion-canvas/inkscape-svg";
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
    inkscapeSVGLoader: InkscapeSVGLoader,
    motionCanvasNodeTreeFactory: NodeTreeFactory,
  },) {
  }

  async readTranslateAndWriteAll(config: MainConfig):
    Promise<void> {
    for (const svgConfig of config.vectorImages) {
      const inputFilePath = svgConfig.input.filePath;

      const inkscapeSVG = await this.deps.inkscapeSVGLoader.load(inputFilePath);

      const motionCanvasNodeTreeFields = inkscapeSVG.toMotionCanvasNodeTreeFields();
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
      const inkscapeSVG = await this.deps.inkscapeSVGLoader.load(inputFilePath);

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
      inkscapeSVGLoader: initInkscapeSVGLoader(),
      motionCanvasNodeTreeFactory: initFactory(),
    });
