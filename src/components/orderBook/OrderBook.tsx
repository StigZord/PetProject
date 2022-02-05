import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageVisibility } from '../../hooks/usePageVisibility';
import type { AppDispatch, AppState } from '../../state';
import { OrderBookActionTypes } from '../../state/actions/orderBook.actions';
import type {
  OrderBookState,
  OrderDisplayProps,
} from '../../state/reducers/orderBook.reducer';
import type { Order, Price } from '../../types/orderBook.types';

import styles from './OrderBook.module.scss';
import { OrderBookHeader } from './orderBookHeader/OrderBookHeader';
import { Spread } from './orderBookHeader/spread/Spread';
import { OrderList, OrderListHeader } from './orderList/OrderList';
import { generateOrdersToDisplay } from './utils/orderBook.helpers';

const getSpread = (asks: OrderDisplayProps[], bids: OrderDisplayProps[]) => {
  if (!asks.length || !bids.length) {
    return {
      spread: 0,
      percent: 0,
    };
  }

  return {
    spread: asks[0].price - bids[0].price,
    percent: 1 - bids[0].price / asks[0].price,
  };
};

interface OrderBookContentProps {
  asks: OrderDisplayProps[];
  bids: OrderDisplayProps[];
}

const OrderBookContent: React.FunctionComponent<OrderBookContentProps> = ({
  asks,
  bids,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isPageVisible = usePageVisibility();

  useEffect(() => {
    if (!isPageVisible) {
      console.debug('Page Not Visible Stop Stream');
      dispatch({ type: OrderBookActionTypes.CloseStream });
    }
  }, [dispatch, isPageVisible]);

  const maxTotal =
    Math.max(bids[bids.length - 1]?.total, asks[asks.length - 1]?.total) || 0;
  const { spread, percent } = getSpread(asks, bids);

  return (
    <div className={styles.orderBook}>
      <OrderBookHeader spread={spread} percent={percent} />
      <OrderListHeader type={'bids'} />
      <OrderList type='bids' orders={bids} maxTotal={maxTotal} />
      <Spread spread={spread} percent={percent} />
      <OrderListHeader type={'asks'} />
      <OrderList type='asks' orders={asks} maxTotal={maxTotal} />
    </div>
  );
};

let counter = 0;
let prevTime = 0;
let startTime = 0;
let stop = false;

const updateCounter = () => {
  if (stop) {
    return;
  }
  if (counter === 0) {
    console.time('start');
    startTime = Date.now();
    prevTime = startTime;
  }
  counter++;
  prevTime = Date.now();

  if (prevTime >= startTime + 10000) {
    console.timeEnd('start');
    console.debug('rerendered', counter, 'times');
    stop = true;
  }
};

export const OrderBook: React.FunctionComponent = () => {
  const orderBookState = useSelector<AppState, OrderBookState>(
    (state: AppState) => state.orderBook
  );
  const [displayBids, setDisplayBids] = useState<OrderDisplayProps[]>([]);
  const [displayAsks, setDisplayAsks] = useState<OrderDisplayProps[]>([]);

  const asksFrameRef = useRef<number | null>(null);

  useEffect(() => {
    asksFrameRef.current = requestAnimationFrame(() => {
      if (orderBookState.type === 'Connected') {
        setDisplayAsks(
          generateOrdersToDisplay({
            orders: orderBookState.asks,
            ordersShown: orderBookState.lastVisibleIndexes.asksIndex,
          })
        );
        setDisplayBids(
          generateOrdersToDisplay({
            orders: orderBookState.bids,
            ordersShown: orderBookState.lastVisibleIndexes.bidsIndex,
          })
        );
      }
    });

    return () => {
      if (asksFrameRef.current) {
        cancelAnimationFrame(asksFrameRef.current);
      }
    };
  }, [orderBookState]);

  return <OrderBookContent bids={displayBids} asks={displayAsks} />;
};
