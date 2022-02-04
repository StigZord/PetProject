import styles from './OrderBookHeader.module.scss';
import { Spread } from './spread/Spread';

interface OrderBookHeaderProps {
  spread: number;
  percent: number;
}

export const OrderBookHeader: React.FunctionComponent<OrderBookHeaderProps> = ({
  spread,
  percent,
}) => {
  return (
    <div className={styles.header}>
      <div>Order Book</div>
      <Spread
        className={styles.spreadInHeader}
        spread={spread}
        percent={percent}
      />
    </div>
  );
};
