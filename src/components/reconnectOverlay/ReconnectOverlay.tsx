import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../state';
import { OrderBookActionTypes } from '../../state/actions/orderBook.actions';
import styles from './ReconnectOverlay.module.scss';

interface ReconnectOverlayProps {
  visible: boolean;
}

export const ReconnectOverlay: React.FunctionComponent<
  ReconnectOverlayProps
> = ({ visible }) => {
  const dispatch = useDispatch<AppDispatch>();

  const onReconnectClick = useCallback(() => {
    dispatch({ type: OrderBookActionTypes.OpenStream });
  }, [dispatch]);

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.textContainer}>
        <div>You have been disconnected</div>
        <button className={styles.button} onClick={onReconnectClick}>
          Reconnect
        </button>
      </div>
    </div>
  );
};
