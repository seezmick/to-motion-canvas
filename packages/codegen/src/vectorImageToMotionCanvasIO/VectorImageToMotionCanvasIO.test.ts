import t from 'tap';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { _VectorImageToMotionCanvasIO } from './VectorImageToMotionCanvasIO';
import { FsWrapper } from '../wrappers/FsWrapper';
import { InkscapeSVGConfig, MainConfig } from '../mainConfig/MainConfigSchema';
import { PathWrapper } from '../wrappers/PathWrapper';
import { VectorImageLoader } from './VectorImageLoader';
import { VectorImage } from '@to-motion-canvas/utilities';
import { MotionCanvasNodeTree } from '../motionCanvasNodeTree/MotionCanvasNodeTree';
import { Factory } from '../motionCanvasNodeTree/factory/Factory';
import { MotionCanvasNodeTreeFields } from '@to-motion-canvas/utilities';

t.test('readTranslateAndWriteAll reads InkscapeSVGs, translates, and writes each',
  async t => {
    const config1: InkscapeSVGConfig = {
      input: {
        filePath: "./circles_1920_by_1080.svg",
      },
      output: {
        directoryPath: "./src/vectorImageGenerated",
        viewAdderFunctionName: 'circles1920By1080',
      }
    };

    const config2: InkscapeSVGConfig = {
      input: {
        filePath: "./rects_1920_by_1080.svg",
      },
      output: {
        directoryPath: "./src/vectorImageGenerated",
        viewAdderFunctionName: 'rects1920By1080',
      }
    }

    const config3: InkscapeSVGConfig = {
      input: {
        filePath: "./landing_page_lg.svg",
      },
      output: {
        directoryPath: "./src/pagesOutput",
        viewAdderFunctionName: 'landingPageLarge',
      }
    };

    const motionCanvasNodeTreeFactory = Substitute.for<Factory>();
    const vectorImageLoader = Substitute.for<VectorImageLoader>();

    // start 1
    const vectorImage1 = Substitute.for<VectorImage>();
    vectorImageLoader
      .load("./circles_1920_by_1080.svg")
      .returns(Promise.resolve(vectorImage1));

    const motionCanvasNodeTree1Fields: MotionCanvasNodeTreeFields = {
      nodes: [],
      canvasHeight: 1234,
      canvasWidth: 4567,
    };
    vectorImage1
      .toMotionCanvasNodeTreeFields()
      .returns(motionCanvasNodeTree1Fields);

    const motionCanvasNodeTree1 = Substitute.for<MotionCanvasNodeTree>();
    motionCanvasNodeTreeFactory
      .init(motionCanvasNodeTree1Fields)
      .returns(motionCanvasNodeTree1)

    motionCanvasNodeTree1
      .generateOutputFiles(config1)
      .returns(Promise.resolve());
    // end 1
    // start 2
    const vectorImage2 = Substitute.for<VectorImage>();
    vectorImageLoader
      .load("./rects_1920_by_1080.svg")
      .returns(Promise.resolve(vectorImage2));

    const motionCanvasNodeTree2Fields: MotionCanvasNodeTreeFields = {
      nodes: [],
      canvasHeight: 4218,
      canvasWidth: 1111,
    };
    vectorImage2
      .toMotionCanvasNodeTreeFields()
      .returns(motionCanvasNodeTree2Fields);

    const motionCanvasNodeTree2 = Substitute.for<MotionCanvasNodeTree>();
    motionCanvasNodeTreeFactory
      .init(motionCanvasNodeTree2Fields)
      .returns(motionCanvasNodeTree2)

    motionCanvasNodeTree2
      .generateOutputFiles(config2)
      .returns(Promise.resolve());
    // end 2
    // start 3
    const vectorImage3 = Substitute.for<VectorImage>();
    vectorImageLoader
      .load("./landing_page_lg.svg")
      .returns(Promise.resolve(vectorImage3));

    const motionCanvasNodeTree3Fields: MotionCanvasNodeTreeFields = {
      nodes: [],
      canvasHeight: 4318,
      canvasWidth: 1111,
    };
    vectorImage3
      .toMotionCanvasNodeTreeFields()
      .returns(motionCanvasNodeTree3Fields);

    const motionCanvasNodeTree3 = Substitute.for<MotionCanvasNodeTree>();
    motionCanvasNodeTreeFactory
      .init(motionCanvasNodeTree3Fields)
      .returns(motionCanvasNodeTree3)


    motionCanvasNodeTree3
      .generateOutputFiles(config3)
      .returns(Promise.resolve());
    // end 3

    const mainConfig: MainConfig = {
      vectorImages: [
        config1,
        config2,
        config3,
      ]
    };

    const svgToMotionCanvasIO = new _VectorImageToMotionCanvasIO({
      pathWrapper: Substitute.for<PathWrapper>(),
      vectorImageLoader: vectorImageLoader,
      motionCanvasNodeTreeFactory,
    });

    await svgToMotionCanvasIO.readTranslateAndWriteAll(mainConfig)

    // start testing internal

    // start 1
    vectorImageLoader
      .received()
      .load("./circles_1920_by_1080.svg");

    vectorImage1
      .received()
      .toMotionCanvasNodeTreeFields();

    motionCanvasNodeTreeFactory
      .received()
      .init(motionCanvasNodeTree1Fields);

    motionCanvasNodeTree1
      .received()
      .generateOutputFiles(config1);
    // end 1
    // start 2
    vectorImageLoader
      .received()
      .load("./circles_1920_by_1080.svg");

    vectorImage2
      .received()
      .toMotionCanvasNodeTreeFields();

    motionCanvasNodeTreeFactory
      .received()
      .init(motionCanvasNodeTree2Fields);

    motionCanvasNodeTree2
      .received()
      .generateOutputFiles(config2);
    // end 2
    // start 3
    vectorImageLoader
      .received()
      .load("./circles_1920_by_1080.svg");

    vectorImage3
      .received()
      .toMotionCanvasNodeTreeFields();

    motionCanvasNodeTreeFactory
      .received()
      .init(motionCanvasNodeTree3Fields);

    motionCanvasNodeTree3
      .received()
      .generateOutputFiles(config3);
    // end 3

    // end testing internal
    t.end();
  });

t.test('getOnChangeCallback gives a function with the right behaviour', async t => {
  const config1: InkscapeSVGConfig = {
    input: {
      filePath: "./circles_1920_by_1080.svg",
    },
    output: {
      directoryPath: "./src/vectorImageGenerated",
      viewAdderFunctionName: 'circles1920By1080',
    }
  };

  const config2: InkscapeSVGConfig = {
    input: {
      filePath: "./rects_1920_by_1080.svg",
    },
    output: {
      directoryPath: "./src/vectorImageGenerated",
      viewAdderFunctionName: 'rects1920By1080',
    }
  }

  const config3: InkscapeSVGConfig = {
    input: {
      filePath: "./landing_page_lg.svg",
    },
    output: {
      directoryPath: "./src/pagesOutput",
      viewAdderFunctionName: 'landingPageLarge',
    }
  };

  const configs = [config1, config2, config3];

  const pathWrapper = Substitute.for<PathWrapper>();

  pathWrapper
    .relative(
      './circles_1920_by_1080.svg',
      'rects_1920_by_1080.svg')
    .returns('not-empty');

  pathWrapper
    .relative(
      './rects_1920_by_1080.svg',
      'rects_1920_by_1080.svg')
    .returns('');


  const motionCanvasNodeTreeFactory = Substitute.for<Factory>();
  const vectorImageLoader = Substitute.for<VectorImageLoader>();

  const vectorImage = Substitute.for<VectorImage>();
  vectorImageLoader
    .load("./rects_1920_by_1080.svg")
    .returns(Promise.resolve(vectorImage));

  const motionCanvasNodeTreeFields: MotionCanvasNodeTreeFields = {
    nodes: [],
    canvasHeight: 234,
    canvasWidth: 4567,
  };
  vectorImage
    .toMotionCanvasNodeTreeFields()
    .returns(motionCanvasNodeTreeFields);

  const newMotionCanvasNodeTree = Substitute.for<MotionCanvasNodeTree>();
  motionCanvasNodeTreeFactory
    .init(motionCanvasNodeTreeFields)
    .returns(newMotionCanvasNodeTree)


  newMotionCanvasNodeTree
    .generateOutputFiles(config2)
    .returns(Promise.resolve());

  const svgToMotionCanvasIO = new _VectorImageToMotionCanvasIO({
    pathWrapper,
    vectorImageLoader,
    motionCanvasNodeTreeFactory,
  });

  const callback = svgToMotionCanvasIO.getOnChangeCallbackFn(configs);
  await callback('rects_1920_by_1080.svg');

  // start testing internal calls

  pathWrapper
    .received()
    .relative(
      './circles_1920_by_1080.svg',
      'rects_1920_by_1080.svg');

  pathWrapper
    .received()
    .relative(
      './rects_1920_by_1080.svg',
      'rects_1920_by_1080.svg');

  vectorImageLoader
    .received()
    .load("./rects_1920_by_1080.svg");

  vectorImage
    .received()
    .toMotionCanvasNodeTreeFields();

  motionCanvasNodeTreeFactory
    .received()
    .init(motionCanvasNodeTreeFields);

  newMotionCanvasNodeTree
    .received()
    .generateOutputFiles(config2);
  // end testing internal calls

  t.end();
});

