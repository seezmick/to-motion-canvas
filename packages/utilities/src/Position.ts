import { NumberOrNumericalExpression } from "./numericalExpression/utils";

export type Position<T extends NumberOrNumericalExpression> = [T, T];
