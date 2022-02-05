import React, { useCallback, useEffect } from 'react';
import styles from './App.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { OrderBook } from './components/orderBook';
import type { ProductId } from './types/orderBook.types';
import { OrderBookActionTypes } from './state/actions/orderBook.actions';
import type { AppDispatch, AppState } from './state';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

const getNewProductId = (productId: ProductId): ProductId =>
  productId === 'PI_XBTUSD' ? 'PI_ETHUSD' : 'PI_XBTUSD';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const currentProductId = useSelector<AppState, ProductId>(
    (state) => state.orderBook.productId
  );

  useEffect(() => {
    dispatch({ type: OrderBookActionTypes.OpenStream });
  }, [dispatch]);

  const onSwitchContract = useCallback(() => {
    const productId = getNewProductId(currentProductId);
    dispatch({
      type: OrderBookActionTypes.SwitchContract,
      productId,
    });
  }, [currentProductId, dispatch]);

  return (
    <ErrorBoundary>
      <div className={styles.appContainer}>
        <OrderBook />
        <div className={styles.footer}>
          <button className={styles.toggleButton} onClick={onSwitchContract}>
            Toggle Feed
          </button>
          <div className={styles.productInfo}>{currentProductId}</div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
