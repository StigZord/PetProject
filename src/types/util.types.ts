import type { Size, Total } from './orderBook.types';

export type Brand<K, T> = K & { __brand: T };

export const asNumber = (value: Size | Total): number => value as number;
export const asTotal = (value: Size | number): Total => value as Total;

// An assertion function that let's you assert any condition.
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
