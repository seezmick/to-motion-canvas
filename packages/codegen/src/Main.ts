import { ChokidarWrapper, initChokidarWrapper } from "./wrappers/ChokidarWrapper";
import { initMainConfigLoader, MainConfigLoader } from "./mainConfig/MainConfigLoader";
import { initVectorImageToMotionCanvasIO, VectorImageToMotionCanvasIO, } from "./vectorImageToMotionCanvasIO/VectorImageToMotionCanvasIO";

export interface Main {
  run(): Promise<void>;
}

export class _Main implements Main {
  constructor(public deps: {
    mainConfigLoader: MainConfigLoader,
    chokidar: ChokidarWrapper,
    vectorImageToMotionCanvasIO: VectorImageToMotionCanvasIO,
  }) { }

  async run(): Promise<void> {
    const config = await this.deps.mainConfigLoader
      .load(`toMotionCanvasConfig.toml`);

    await this.deps.vectorImageToMotionCanvasIO
      .readTranslateAndWriteAll(config);

    const inputFilePaths = config.vectorImages
      .map(svg => svg.input.filePath);

    const watcher = this.deps.chokidar
      .watch(inputFilePaths, {
        persistent: true
      });

    watcher.on('change',
      this.deps.vectorImageToMotionCanvasIO
        .getOnChangeCallbackFn(config.vectorImages));
  }
}

export type InitMainFn = () => Main;

export const initMain = () => new _Main({
  mainConfigLoader: initMainConfigLoader(),
  chokidar: initChokidarWrapper(),
  vectorImageToMotionCanvasIO: initVectorImageToMotionCanvasIO(),
});
