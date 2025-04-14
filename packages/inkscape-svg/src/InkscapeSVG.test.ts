import t from 'tap';
import { _InkscapeSVG, InkscapeSVGFields, ViewBox } from './InkscapeSVG';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { _RectElement } from './element/rectElement/RectElement';
import { Element } from './element/Element';
import { RectNodeFields } from '@to-motion-canvas/utilities';
import { MotionCanvasNodeTreeFields } from '@to-motion-canvas/utilities';

const inkscapeSVGElements = [
  {
    element: Substitute.for<Element>(),
    motionCanvasNodesFields: [
      {
        refName: 'firstMotionCanvasNodesFields1',
        type: 'Rect',
        children: [],
      } as RectNodeFields,
      {
        refName: 'firstMotionCanvasNodesFields2',
        type: 'Rect',
        children: [],
      } as RectNodeFields,
      {
        refName: 'firstMotionCanvasNodesFields3',
        type: 'Rect',
        children: [],
      } as RectNodeFields,
      {
        refName: 'firstMotionCanvasNodesFields4',
        type: 'Rect',
        children: [],
      } as RectNodeFields,
    ],
  },
  {
    element: Substitute.for<Element>(),
    motionCanvasNodesFields: [
      {
        refName: 'secondMotionCanvasNodesFields1',
        type: 'Rect',
        children: [],
      } as RectNodeFields,
    ],
  },
]


const rectInkscapeSVG: InkscapeSVGFields = {
  width: 1920,
  height: 1080,
  viewBox: {
    minX: 0,
    minY: 0,
    width: 508,
    height: 285.75,
  } as ViewBox,
  elements: [
    ...(inkscapeSVGElements.map(elem => elem.element))
  ],
};

t.test('constructor correctly assigns props to same-name fields', t => {
  const inkscapeSVG = new _InkscapeSVG({
  }, rectInkscapeSVG);

  // all the fields found on `rects[i].props`
  // are also found on `rectElement`
  for (let [k, v] of Object.entries(rectInkscapeSVG)) {
    const key = (inkscapeSVG as any)[k];
    t.equal(key, v, `expected ${key} to equal ${v}`);
  }
  t.end();
});

t.test('toMotionCanvasNodeTreeFields correctly creates using initMotionCanvasNodeTreeFn', t => {
  for (let i = 0; i < inkscapeSVGElements.length; i++) {
    const { element, motionCanvasNodesFields } = inkscapeSVGElements[i];
    element
      .toMotionCanvasNodesFields()
      .returns(motionCanvasNodesFields);
  }

  const nodes = inkscapeSVGElements.map(elem => elem.motionCanvasNodesFields).flat();

  const nodeTreeFields: MotionCanvasNodeTreeFields = {
    nodes,
    canvasHeight: 1080,
    canvasWidth: 1920,
  };

  const inkscapeSVG = new _InkscapeSVG({
  }, rectInkscapeSVG);

  const found = inkscapeSVG.toMotionCanvasNodeTreeFields();
  const wanted = nodeTreeFields;

  // start testing internal calls


  // end testing internal calls

  t.same(found, wanted);
  t.end();
});
