import { _NumericalExpression } from "../NumericalExpression";
import { Operator } from "../utils";

export interface GetStringFnOptions {
  excludeBrackets?: boolean;
}

export interface Node {
  getString(options?: GetStringFnOptions): string;
  toWrappedInContainerNode(): Node;
  push(node: Node): Node;
  clone(): Node;
  updateLastDescendent(value: number, operator?: Operator): void;
  getLastChild(): Node | null;
  isLeafNode(): boolean;
  isBranchNode(): boolean;
  setOperator(operator: Operator): void;
}

