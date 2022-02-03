import React from 'react';
import styles from './App.module.scss';
import { useDispatch } from 'react-redux';
import { OrderBook } from './components/orderBook';

function App() {
  const dispatch = useDispatch();

  return (
    <div className={styles.AppContainer}>
      <button onClick={() => dispatch({ type: 'OpenStream' })}>open</button>
      <button onClick={() => dispatch({ type: 'CloseStream' })}>close</button>
      <OrderBook />
    </div>
  );
}

export default App;
