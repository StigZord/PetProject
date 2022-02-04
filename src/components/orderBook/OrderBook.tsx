import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageVisibility } from '../../hooks/usePageVisibility';
import type { AppDispatch, RootState } from '../../state';
import { OrderBookActionTypes } from '../../state/actions/orderBook.actions';
import type {
  CalculatedOrderDetails,
  OrderBookState,
} from '../../state/reducers/orderBook.reducer';
import type { Price } from '../../types/orderBook.types';

import styles from './OrderBook.module.scss';
import { OrderBookHeader } from './orderBookHeader/OrderBookHeader';
import { Spread } from './orderBookHeader/spread/Spread';
import { OrderList } from './orderList/OrderList';

const getSpread = (
  asks: Map<Price, CalculatedOrderDetails>,
  bids: Map<Price, CalculatedOrderDetails>
) => {
  const lowestAsk = asks.values().next();
  const highestBid = bids.values().next();

  if (!lowestAsk.done && !highestBid.done) {
    return {
      spread: lowestAsk.value.price - highestBid.value.price,
      percent: 1 - highestBid.value.price / lowestAsk.value.price,
    };
  }

  throw Error('Unexpected error: Missing asks or bids');
};

export const OrderBook: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isPageVisible = usePageVisibility();
  const state = useSelector<RootState, OrderBookState>(
    (state: RootState) => state.orderBook
  );

  useEffect(() => {
    if (!isPageVisible) {
      dispatch({ type: OrderBookActionTypes.CloseStream });
    }
  }, [dispatch, isPageVisible]);

  if (state.type !== 'Connected' && state.type !== 'Disconnected') {
    return <div>place for loader</div>;
  }

  const { spread, percent } = getSpread(state.asks, state.bids);

  return (
    <div className={styles.orderBook}>
      <OrderBookHeader spread={spread} percent={percent} />
      <OrderList
        type='bids'
        orderDetailsMap={state.bids}
        maxTotal={state.maxTotal.totalValue}
      />
      <Spread spread={spread} percent={percent} />
      <OrderList
        type='asks'
        orderDetailsMap={state.asks}
        maxTotal={state.maxTotal.totalValue}
      />
    </div>
  );
};
