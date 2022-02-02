import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePageVisibility } from '../hooks/usePageVisibility';
import type { AppDispatch } from '../state';
import { OrderBookActionTypes } from '../state/actions/orderBook.actions';

export const OrderBook: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isPageVisible = usePageVisibility();

  useEffect(() => {
    console.debug('use effect');
    if (!isPageVisible) {
      dispatch({ type: OrderBookActionTypes.CloseStream });
    }
  }, [dispatch, isPageVisible]);

  return <div></div>;
};
