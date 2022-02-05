import type { Order, Price, Size } from '../../../types/orderBook.types';
import { mergeSortedOrdersAndFilterZeroSize } from './orderBook.helpers';

const createOrder = (price: number, size: number = 10): Order => [
  price as Price,
  size as Size,
];

describe('mergeSortedOrders', () => {
  it('should merge two previously sorted arrays', () => {
    const ordersA: Order[] = [
      createOrder(1),
      createOrder(3),
      createOrder(5),
      createOrder(6),
      createOrder(10),
    ];
    const ordersB: Order[] = [createOrder(2), createOrder(4), createOrder(9)];

    const expected = [
      createOrder(1),
      createOrder(2),
      createOrder(3),
      createOrder(4),
      createOrder(5),
      createOrder(6),
      createOrder(9),
      createOrder(10),
    ];

    expect(mergeSortedOrdersAndFilterZeroSize(ordersA, ordersB, 'asc')).toEqual(
      expected
    );
    expect(
      mergeSortedOrdersAndFilterZeroSize(
        ordersA.reverse(),
        ordersB.reverse(),
        'desc'
      )
    ).toEqual(expected.reverse());
  });

  it('should merge with empty array', () => {
    const ordersA: Order[] = [
      createOrder(1),
      createOrder(3),
      createOrder(5),
      createOrder(6),
      createOrder(10),
    ];
    const ordersB: Order[] = [];

    const expected = [
      createOrder(1),
      createOrder(3),
      createOrder(5),
      createOrder(6),
      createOrder(10),
    ];

    expect(mergeSortedOrdersAndFilterZeroSize(ordersA, ordersB, 'asc')).toEqual(
      expected
    );
    expect(
      mergeSortedOrdersAndFilterZeroSize(
        ordersA.reverse(),
        ordersB.reverse(),
        'desc'
      )
    ).toEqual(expected.reverse());
  });

  it('should merge and replace value with same price', () => {
    const ordersA: Order[] = [
      createOrder(1),
      createOrder(3),
      createOrder(5),
      createOrder(6),
      createOrder(10),
    ];
    const ordersB: Order[] = [
      createOrder(2),
      createOrder(4),
      createOrder(5, 1337),
      createOrder(9),
    ];

    const expected = [
      createOrder(1),
      createOrder(2),
      createOrder(3),
      createOrder(4),
      createOrder(5, 1337),
      createOrder(6),
      createOrder(9),
      createOrder(10),
    ];

    expect(mergeSortedOrdersAndFilterZeroSize(ordersA, ordersB, 'asc')).toEqual(
      expected
    );
    expect(
      mergeSortedOrdersAndFilterZeroSize(
        ordersA.reverse(),
        ordersB.reverse(),
        'desc'
      )
    ).toEqual(expected.reverse());
  });

  it('should merge and remove value with same price and size equal zero', () => {
    const ordersA: Order[] = [
      createOrder(1),
      createOrder(3),
      createOrder(5),
      createOrder(6),
      createOrder(10),
    ];
    const ordersB: Order[] = [
      createOrder(2),
      createOrder(4),
      createOrder(5, 0),
      createOrder(9),
      createOrder(12, 0),
    ];

    const expected = [
      createOrder(1),
      createOrder(2),
      createOrder(3),
      createOrder(4),
      createOrder(6),
      createOrder(9),
      createOrder(10),
    ];

    expect(mergeSortedOrdersAndFilterZeroSize(ordersA, ordersB, 'asc')).toEqual(
      expected
    );
    expect(
      mergeSortedOrdersAndFilterZeroSize(
        ordersA.reverse(),
        ordersB.reverse(),
        'desc'
      )
    ).toEqual(expected.reverse());
  });
});
