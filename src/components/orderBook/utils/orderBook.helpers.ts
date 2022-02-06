import type { OrderDisplayProps } from '../../../state/reducers/orderBook.reducer';
import type { Order } from '../../../types/orderBook.types';
import { asTotal } from '../../../types/util.types';

// Both arrays need to be previously sorted, and also removes zero size orders
export const mergeSortedOrdersAndFilterZeroSize = (
  original: Order[],
  toBeMerged: Order[],
  direction: 'asc' | 'desc'
): Order[] => {
  if (toBeMerged.length === 0) {
    return original;
  }

  const result: Order[] = [];
  let originalIndex = 0;
  let toBeMergedIndex = 0;

  while (
    originalIndex < original.length &&
    toBeMergedIndex < toBeMerged.length
  ) {
    if (
      (direction === 'asc' &&
        original[originalIndex][0] < toBeMerged[toBeMergedIndex][0]) ||
      (direction === 'desc' &&
        original[originalIndex][0] > toBeMerged[toBeMergedIndex][0])
    ) {
      result.push(original[originalIndex]);
      originalIndex++;
    } else if (
      (direction === 'asc' &&
        original[originalIndex][0] > toBeMerged[toBeMergedIndex][0]) ||
      (direction === 'desc' &&
        original[originalIndex][0] < toBeMerged[toBeMergedIndex][0])
    ) {
      if (toBeMerged[toBeMergedIndex][1] > 0) {
        result.push(toBeMerged[toBeMergedIndex]);
      }
      toBeMergedIndex++;
    } else {
      // If equal this will omit original value and overwrite it
      // unless size === 0 then it will be removed
      if (toBeMerged[toBeMergedIndex][1] > 0) {
        result.push(toBeMerged[toBeMergedIndex]);
      }
      originalIndex++;
      toBeMergedIndex++;
    }
  }

  // Using forEach instead of .(...push(arr.filter(...))) to prevent
  // traversing same array twice
  original.slice(originalIndex).forEach((order) => {
    if (order[1] > 0) {
      result.push(order);
    }
  });

  // Using forEach instead of .(...push(arr.filter(...))) to prevent
  // traversing same array twice
  toBeMerged.slice(toBeMergedIndex).forEach((order) => {
    if (order[1] > 0) {
      result.push(order);
    }
  });
  return result;
};

export const generateOrdersToDisplay = (
  orders: Order[],
  ordersShown: number
): OrderDisplayProps[] => {
  return orders
    .slice(0, ordersShown)
    .reduce<OrderDisplayProps[]>((acc, [price, size]) => {
      const total = (acc.length ? acc[acc.length - 1].total : 0) + size;
      acc.push({ price, size, total: asTotal(total) });

      return acc;
    }, []);
};
