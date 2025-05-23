import { initContainerNode, InitContainerNodeFn } from "./node/ContainerNode";
import { Node } from "./node/Node";
import { initLeafNode, InitLeafNodeFn } from "./node/LeafNode";
import { _isNumber, _isNumericalExpression, Operator } from "./utils";
import { NumberOrNumericalExpression } from "./utils";

// This class exists because the result of this
// library is code that will be processed on a higher
// layer of execution.
//
// This class then serves the purpose of generating
// in the output code an expression like 1+1 
// instead of its resolution 2.
//
// The purpose of outputting unresolved expressions 
// even though they will be computed the same is to
// give users of this library a hint about where values
// are coming from.
export interface NumericalExpression {
  add(value: NumberOrNumericalExpression): NumericalExpression;
  subtract(value: NumberOrNumericalExpression): NumericalExpression;
  divide(value: NumberOrNumericalExpression): NumericalExpression;
  multiply(value: NumberOrNumericalExpression): NumericalExpression;

  getString(): string;
  getRootNodeAfterSettingOperator(operator?: Operator): Node;
}

export class _NumericalExpression implements NumericalExpression {
  root: Node;

  constructor(public deps: {
    initContainerNodeFn: InitContainerNodeFn,
    initLeafNodeFn: InitLeafNodeFn,
  },
    start: NumberOrNumericalExpression, root?: Node,) {
    // the last arg "root" is here for testing purposes
    if (root == null) {
      this.root = deps.initLeafNodeFn(Operator.FirstTerm, start);
    }
    else {
      this.root = root;
    }
  }

  getString(): string {
    return this.root.getString({
      excludeBrackets: true
    });
  }

  update(
    operator: Operator,
    operand: NumberOrNumericalExpression
  ): NumericalExpression {
    const rootLastChild: Node | null = this.root.getLastChild();
    if (
      _isNumber(operand) &&
      (this.root.isLeafNode()
        || (rootLastChild != null ? rootLastChild.isLeafNode() : false))
    ) {
      this.root.updateLastDescendent(operand, operator);
    }
    else {
      this.root = this.root.toWrappedInContainerNode();
      if (_isNumber(operand)) {
        this.root = this.root.push(
          this.deps.initLeafNodeFn(operator, operand));
      }
      else if (_isNumericalExpression(operand)) {
        this.root = this.root.push(
          operand.getRootNodeAfterSettingOperator(operator));
      }
      else {
        throw new Error(`Got unexpected operand: ${operand}`);
      }
    }

    return this;
  }

  clone(): NumericalExpression {
    return new _NumericalExpression(this.deps, 0, this.root.clone());
  }

  add(value: NumberOrNumericalExpression): NumericalExpression {
    return this.update(Operator.Add, value);
  }

  subtract(value: NumberOrNumericalExpression): NumericalExpression {
    return this.update(Operator.Subtract, value);
  }

  multiply(value: NumberOrNumericalExpression): NumericalExpression {
    return this.update(Operator.Multiply, value);
  }

  divide(value: NumberOrNumericalExpression): NumericalExpression {
    return this.update(Operator.Divide, value);
  }

  getRootNodeAfterSettingOperator(operator?: Operator) {
    if (operator != null) {
      this.root.setOperator(operator);
    }

    return this.root;
  }
}

export type InitNumericalExpressionFn
  = (value: NumberOrNumericalExpression) => NumericalExpression;

export const initNumericalExpression: InitNumericalExpressionFn
  = (value: NumberOrNumericalExpression) => new _NumericalExpression({
    initContainerNodeFn: initContainerNode,
    initLeafNodeFn: initLeafNode,
  }, value);
