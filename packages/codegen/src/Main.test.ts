import t from 'tap';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { MainConfigLoader } from './mainConfig/MainConfigLoader';
import { VectorImageToMotionCanvasIO, OnChangeCallbackFn } from './vectorImageToMotionCanvasIO/VectorImageToMotionCanvasIO';
import { ChokidarWrapper } from './wrappers/ChokidarWrapper';
import { _Main } from './Main';
import { MainConfig } from './mainConfig/MainConfigSchema';
import { FSWatcherWrapper } from './wrappers/FSWatcherWrapper';

t.test('run runs right!', async t => {
  const mainConfigLoader = Substitute.for<MainConfigLoader>();
  const vectorImageToMotionCanvasIO = Substitute.for<VectorImageToMotionCanvasIO>();
  const chokidar = Substitute.for<ChokidarWrapper>();

  const mainConfig: MainConfig = {
    vectorImages: [
      {
        input: {
          filePath: "./circles_1920_by_1080.svg",
        },
        output: {
          directoryPath: "./src/vectorImageGenerated",
          viewAdderFunctionName: 'circles1920By1080',
        }
      },
      {
        input: {
          filePath: "./rects_1920_by_1080.svg",
        },
        output: {
          directoryPath: "./src/vectorImageGenerated",
          viewAdderFunctionName: 'rects1920By1080',
        }
      },
      {
        input: {
          filePath: "./landing_page_lg.svg",
        },
        output: {
          directoryPath: "./src/pagesOutput",
          viewAdderFunctionName: 'landingPageLarge',
        }
      },
    ]
  };

  mainConfigLoader
    .load('toMotionCanvasConfig.toml')
    .returns(Promise.resolve({ ...mainConfig } as MainConfig));

  vectorImageToMotionCanvasIO
    .readTranslateAndWriteAll({ ...mainConfig } as MainConfig)
    .returns(Promise.resolve());

  const fsWatcher = Substitute.for<FSWatcherWrapper>();
  chokidar.watch([
    "./circles_1920_by_1080.svg",
    "./rects_1920_by_1080.svg",
    "./landing_page_lg.svg",
  ], {
    // don't let the program end while watching
    persistent: true
  })
    .returns(fsWatcher);

  const onChangeCallback: OnChangeCallbackFn = (_) => Promise.resolve();

  vectorImageToMotionCanvasIO
    .getOnChangeCallbackFn(mainConfig.vectorImages)
    .returns(onChangeCallback);

  const main = new _Main({
    mainConfigLoader,
    vectorImageToMotionCanvasIO,
    chokidar,
  })

  await main.run();

  // start testing internal calls

  mainConfigLoader
    .received()
    .load('toMotionCanvasConfig.toml');

  vectorImageToMotionCanvasIO
    .received()
    .readTranslateAndWriteAll({ ...mainConfig } as MainConfig)

  chokidar
    .received()
    .watch([
      "./circles_1920_by_1080.svg",
      "./rects_1920_by_1080.svg",
      "./landing_page_lg.svg",
    ], {
      // don't let the program end while watching
      persistent: true
    });

  fsWatcher
    .received().on('change', onChangeCallback);
  // end testing internal calls


  t.end();
});
