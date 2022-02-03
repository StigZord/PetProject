import { formatNumber, formatPercent } from '../../../utls/numberFormater';

import styles from './OrderBookHeader.module.scss';

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
      <div className={styles.spread}>
        Spread {formatNumber(spread, 1)} ({formatPercent(percent)})
      </div>
    </div>
  );
};
