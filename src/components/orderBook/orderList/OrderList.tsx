import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../state';
import { OrderBookActionTypes } from '../../../state/actions/orderBook.actions';
import type { CalculatedOrderDetails } from '../../../state/reducers/orderBook.reducer';
import type { Price } from '../../../types/orderBook.types';
import { formatNumber } from '../../../utls/numberFormater';
import { ORDER_ITEM_HEIGHT } from '../utils/orderBook.constants';

import styles from './OrderList.module.scss';

const bidsGradientColora = '#1B3434';
const asksGradientColor = '#392028';

interface OrderListProps {
  type: 'asks' | 'bids';
  orderDetailsMap: Map<Price, CalculatedOrderDetails>;
  maxTotal: number;
}

export const OrderList: React.FunctionComponent<OrderListProps> = ({
  type,
  orderDetailsMap,
  maxTotal,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxItemsToRender, setMaxItemsToRender] = useState<number>(10);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries && entries[0]) {
        const maxItemsToRender = Math.floor(
          entries[0].contentRect.height / ORDER_ITEM_HEIGHT
        );
        setMaxItemsToRender(maxItemsToRender);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  useEffect(() => {
    dispatch({
      type:
        type === 'bids'
          ? OrderBookActionTypes.UpdateBidsLastVisibleIndex
          : OrderBookActionTypes.UpdateAsksLastVisibleIndex,
      index: maxItemsToRender - 1,
    });
  }, [dispatch, maxItemsToRender, type]);

  const ordersToRender = Array.from(orderDetailsMap.entries()).slice(
    0,
    maxItemsToRender
  );

  return (
    <>
      <OrderListHeader type={type} />
      <div
        ref={containerRef}
        className={classNames(styles.container, {
          [styles.asks]: type === 'asks',
          [styles.bids]: type === 'bids',
        })}
      >
        {ordersToRender.map(([price, orderDetails]) => (
          <OrderListItem
            key={price}
            type={type}
            item={orderDetails}
            maxTotal={maxTotal}
          />
        ))}
      </div>
    </>
  );
};

const OrderListItem: React.FunctionComponent<{
  type: 'asks' | 'bids';
  item: CalculatedOrderDetails;
  maxTotal: number;
}> = ({ type, item, maxTotal }) => {
  return (
    <div
      className={styles.listItem}
      style={{
        background: `linear-gradient(${
          type === 'asks'
            ? `to right, ${asksGradientColor}`
            : `to left, ${bidsGradientColora}`
        } ${(item.total / maxTotal) * 100}%, #0000 0% )`,
      }}
    >
      <div className={styles.priceColor}>{formatNumber(item.price)}</div>
      <div>{formatNumber(item.size, 0)}</div>
      <div>{formatNumber(item.total, 0)}</div>
    </div>
  );
};

const OrderListHeader: React.FunctionComponent<{ type: 'bids' | 'asks' }> = ({
  type,
}) => {
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
};
