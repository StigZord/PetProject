import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { store } from './../../../state';
import { OrderList } from './OrderList';
import type { OrderDisplayProps } from '../../../state/reducers/orderBook.reducer';
import { asPrice, asSize, asTotal } from '../../../types/util.types';
import { Provider } from 'react-redux';
import * as hooks from '../../../hooks/useResizeObserver';

// jest.mock('../../../hooks/useResizeObserver', () => {
//   return jest.fn(() => 10);
// });
jest.spyOn(hooks, 'useResizeObserver').mockImplementation(() => 12);
// const spy = jest.spyOn(useResizeObserver, '');
// spy.mockReturnValue(12);

const generateMockData = function* (
  count: number
): IterableIterator<OrderDisplayProps> {
  let total = 0;

  for (let i = 1; i <= count; i++) {
    const size = i * 10000;
    total += size;
    yield {
      price: asPrice(i * 1000 + 0.5),
      size: asSize(size),
      total: asTotal(total),
    };
  }
};

describe('OrderList', () => {
  it('should render correct values', () => {
    const listSize = 10;
    const asks: OrderDisplayProps[] = Array.from(generateMockData(listSize));

    render(
      <Provider store={store}>
        <OrderList
          type={'asks'}
          orders={asks}
          maxTotal={asks[listSize - 1].total}
        />
      </Provider>
    );
    const list = screen.getAllByRole('listitem');
    expect(list.length).toEqual(listSize);
    expect(within(list[0]).getByText('1,000.50')).toBeTruthy();
    expect(within(list[0]).getAllByText('10,000').length).toEqual(2);

    expect(within(list[list.length - 1]).getByText('10,000.50')).toBeTruthy();
    expect(within(list[list.length - 1]).getByText('100,000')).toBeTruthy();
    expect(within(list[list.length - 1]).getByText('550,000')).toBeTruthy();
  });
});
