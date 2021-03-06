import {
  formatSpreadNumber,
  formatPercent,
} from '../../../../utls/numberFormater';
import styles from '../OrderBookHeader.module.scss';

interface SpreadProps {
  className?: string;
  spread: number;
  percent: number;
}

export const Spread: React.FunctionComponent<SpreadProps> = ({
  className = styles.spread,
  spread,
  percent,
}) => {
  return (
    <div className={className}>
      Spread {formatSpreadNumber(spread)} ({formatPercent(percent)})
    </div>
  );
};
