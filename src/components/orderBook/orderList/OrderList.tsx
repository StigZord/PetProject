import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
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

export const OrderList: React.FunctionComponent<OrderListProps> = ({
  type,
  orders,
  maxTotal,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const containerRef = useRef<HTMLDivElement>(null);
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
    <div
      ref={containerRef}
      className={classNames(styles.container, {
        [styles.asks]: type === 'asks',
        [styles.bids]: type === 'bids',
      })}
    >
      {orders.map((order) => (
        <OrderListItem
          key={order.price}
          type={type}
          item={order}
          maxTotal={maxTotal}
        />
      ))}
    </div>
  );
};

const OrderListItem: React.FunctionComponent<{
  type: 'asks' | 'bids';
  item: OrderDisplayProps;
  maxTotal: number;
}> = React.memo(({ type, item: { price, size, total }, maxTotal }) => {
  return (
    <div
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
    </div>
  );
});

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
