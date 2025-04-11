import t from 'tap';
import { _GroupElementAttributesSchema, GroupElementAttributes } from './GroupElementAttributesSchema';
import { GroupElementFields } from './GroupElement';
import { INode } from 'svgson';

function removeUndefinedFields(obj: Object) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != undefined));
}

t.test('parse correctly processes valid data', t => {
  const nodes: {
    svgsonNode: INode,
    attributes: GroupElementAttributes,
    props: GroupElementFields,
  }[] = [
      {
        svgsonNode: {
          "name": "g",
          "type": "element",
          "value": "",
          "attributes": {
            "id": "g1"
          },
          "children": [
          ]
        },
        attributes: {
          "id": "g1"
        },
        props: {
          id: 'g1',
          children: []
        }
      },
      {
        svgsonNode: {
          "name": "g",
          "type": "element",
          "value": "",
          "attributes": {
            "id": "layer1"
          },
          "children": [
          ]
        },
        attributes: {
          "id": "layer1"
        },
        props: {
          id: 'layer1',
          children: []
        }
      },
      {
        svgsonNode: {
          "name": "g",
          "type": "element",
          "value": "",
          "attributes": {
            "id": "layer1",
            transform: "matrix(3.278713,0,0,3.278713,37.280179,-232.59381)"
          },
          "children": [
          ]
        },
        attributes: {
          "id": "layer1",
          transform: "matrix(3.278713,0,0,3.278713,37.280179,-232.59381)"
        },
        props: {
          id: 'layer1',
          children: []
        }
      },

    ];

  const styleAttributesSchema = new _GroupElementAttributesSchema();

  for (let i = 0; i < nodes.length; i++) {
    const attributesSchema = nodes[i].svgsonNode.attributes;

    const found = removeUndefinedFields(styleAttributesSchema.parse(attributesSchema));
    t.same(found,
      attributesSchema, `at idx: ${i}`);
  }

  t.end();
});

