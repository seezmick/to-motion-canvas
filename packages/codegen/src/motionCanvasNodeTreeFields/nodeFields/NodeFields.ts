export type NodeTypes = 'Rect';// | 'Text'

export interface NodeFieldsWithChildType<T> {
  refName: string;
  type: NodeTypes;
  children: T;
}

export interface NodeFields
  extends NodeFieldsWithChildType<NodeFields[]> { }
