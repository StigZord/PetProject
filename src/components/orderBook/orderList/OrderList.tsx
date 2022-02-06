import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useResizeObserver } from '../../../hooks/useResizeObserver';
import type { AppDispatch } from '../../../state';
import { OrderBookActionTypes } from '../../../state/actions/orderBook.actions';
import type { OrderDisplayProps } from '../../../state/reducers/orderBook.reducer';
import { integerFormatter, priceFormatter } from '../../../utls/numberFormater';

import styles from './OrderList.module.scss';

const bidsGradientColora = '#1B3434';
const asksGradientColor = '#392028';

interface OrderListProps {
  type: 'asks' | 'bids';
  orders: OrderDisplayProps[];
  maxTotal: number;
}

export const OrderList: React.FunctionComponent<OrderListProps> = React.memo(
  ({ type, orders, maxTotal }) => {
    const dispatch = useDispatch<AppDispatch>();
    const containerRef = useRef<HTMLUListElement>(null);
    const maxItemsToRender = useResizeObserver(containerRef);

    useEffect(() => {
      dispatch({
        type:
          type === 'bids'
            ? OrderBookActionTypes.UpdateBidsLastVisibleIndex
            : OrderBookActionTypes.UpdateAsksLastVisibleIndex,
        index: maxItemsToRender - 1,
      });
    }, [dispatch, maxItemsToRender, type]);

    return (
      <ul
        ref={containerRef}
        className={classNames(styles.container, {
          [styles.asks]: type === 'asks',
          [styles.bids]: type === 'bids',
        })}
        data-testid='orderListContainer'
      >
        {orders.map((order, index) => (
          // In general using `index` as key is not advised, but in this case
          // when using unique key (for example price) there are a lot of
          // LayoutShifts due to new content appearing / old removing,
          // but with index as key items are rerendered instead and no LSes are reported
          <OrderListItem
            key={index}
            // key={order.price}
            type={type}
            item={order}
            maxTotal={maxTotal}
          />
        ))}
      </ul>
    );
  }
);

const OrderListItem: React.FunctionComponent<{
  type: 'asks' | 'bids';
  item: OrderDisplayProps;
  maxTotal: number;
}> = ({ type, item: { price, size, total }, maxTotal }) => {
  return (
    <li
      className={styles.listItem}
      style={{
        background: `linear-gradient(${
          type === 'asks'
            ? `to right, ${asksGradientColor}`
            : `to left, ${bidsGradientColora}`
        } ${(total / maxTotal) * 100}%, #0000 0% )`,
      }}
    >
      <div className={styles.priceColor}>{priceFormatter(price)}</div>
      <div>{integerFormatter(size)}</div>
      <div>{integerFormatter(total)}</div>
    </li>
  );
};

export const OrderListHeader: React.FunctionComponent<{
  type: 'bids' | 'asks';
}> = React.memo(({ type }) => {
  return (
    <div
      className={classNames(styles.listItem, styles.header, {
        [styles.bidsHeader]: type === 'bids',
        [styles.asksHeader]: type === 'asks',
      })}
    >
      <div>PRICE</div>
      <div>SIZE</div>
      <div>TOTAL</div>
    </div>
  );
});
