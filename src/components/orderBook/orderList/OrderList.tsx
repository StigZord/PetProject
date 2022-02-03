import classNames from 'classnames';
import type { CalculatedOrderDetails } from '../../../state/reducers/orderBook.reducer';
import type { Price } from '../../../types/orderBook.types';
import { formatNumber } from '../../../utls/numberFormater';

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
  return (
    <div
      className={classNames(styles.container, {
        [styles.asks]: type === 'asks',
        [styles.bids]: type === 'bids',
      })}
    >
      <OrderListHeader />
      {Array.from(orderDetailsMap.entries()).map(([price, orderDetails]) => (
        <OrderListItem
          key={price}
          type={type}
          item={orderDetails}
          maxTotal={maxTotal}
        />
      ))}
    </div>
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

const OrderListHeader: React.FunctionComponent<{}> = () => {
  return (
    <div className={classNames(styles.listItem, styles.header)}>
      <div>PRICE</div>
      <div>SIZE</div>
      <div>TOTAL</div>
    </div>
  );
};
