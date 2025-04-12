import t from 'tap';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { _GroupElement, GroupElementFields } from './GroupElement';
import { InitRectNode } from '../../../motionCanvasNodeTree/node/rectNode/RectNode';
import { Element } from '../Element';
import { RectNodeFields } from '../../../motionCanvasNodeTreeFields/nodeFields/RectNodeFields';
import { NodeFields } from '../../../motionCanvasNodeTreeFields/nodeFields/NodeFields';

t.test('constructor correctly assigns props to same-name fields', t => {
  const props: GroupElementFields[] = [
    {
      "id": "rect1",
      children: [],
    },
    {
      "id": "rect2",
      children: [],
    },
    {

      "id": "rect3",
      children: [],
    },
    {

      "id": "rect4",
      children: [],
    },
  ];

  for (let i = 0; i < props.length; i++) {

    const rectElement = new _GroupElement({
    }, props[i]);

    // all the fields found on `props[i]`
    // are also found on `rectElement`
    for (let [k, v] of Object.entries(props[i])) {
      const key = (rectElement as any)[k];
      t.equal(key, v, `at i=${i}: expected ${key} to equal ${v}`);
    }
  }

  t.end();
});

t.test('toMotionCanvasComponentNode correctly translates to MotionCanvasComponentNode', t => {
  interface InitRectNodeJacket {
    fn: InitRectNode
  }
  const initMotionCanvasRectNodeFnJacket = Substitute.for<InitRectNodeJacket>();

  const childElement1 = Substitute.for<Element>();
  const childElement1MotionCanvasNodeFields: NodeFields = {
    refName: 'childElement1MotionCanvasNodeFields',
    type: 'Rect',
    children: [],
  };
  childElement1.toMotionCanvasNodesFields()
    .returns([childElement1MotionCanvasNodeFields]);

  const childElement2 = Substitute.for<Element>();
  const childElement2MotionCanvasNodeFields: NodeFields = {
    refName: 'childElement2MotionCanvasNodeFields',
    type: 'Rect',
    children: [],
  };
  childElement2.toMotionCanvasNodesFields()
    .returns([childElement2MotionCanvasNodeFields]);

  const childElement3 = Substitute.for<Element>();
  const childElement3MotionCanvasNodeFields: NodeFields = {
    refName: 'childElement3MotionCanvasNodeFields',
    type: 'Rect',
    children: [],
  };
  const childElement3MotionCanvasNode2Fields: NodeFields = {
    refName: 'childElement3MotionCanvasNode2Fields',
    type: 'Rect',
    children: [],
  };
  childElement3.toMotionCanvasNodesFields()
    .returns([childElement3MotionCanvasNodeFields, childElement3MotionCanvasNode2Fields]);

  const rectNodeFields: RectNodeFields = {
    refName: "rect1",
    type: 'Rect',
    children: [childElement1MotionCanvasNodeFields,
      childElement2MotionCanvasNodeFields,
      childElement3MotionCanvasNodeFields,
      childElement3MotionCanvasNode2Fields,
    ] as NodeFields[],
  };

  const groupElement = new _GroupElement({
    initMotionCanvasRectNodeFn: initMotionCanvasRectNodeFnJacket.fn,
  }, {
    "id": "rect1",
    "children": [childElement1, childElement2, childElement3],
  } as GroupElementFields);

  const found = groupElement.toMotionCanvasNodesFields();
  const wanted = [{ ...rectNodeFields } as RectNodeFields];

  // start internal test

  // end internal test

  t.same(found, wanted);
  t.end();
});
