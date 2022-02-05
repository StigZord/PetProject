import type { Reducer } from 'redux';
import { of } from 'rxjs';
import { mergeSortedOrdersAndFilterZeroSize } from '../../components/orderBook/utils/orderBook.helpers';
import type {
  Order,
  OrderBookResponse,
  Price,
  ProductId,
  Size,
  Total,
} from '../../types/orderBook.types';
import { asNumber, assert, asTotal } from '../../types/util.types';
import type {
  DataUpdate,
  OrderBookActions,
  SnapshotReceived,
} from '../actions/orderBook.actions';
import { OrderBookActionTypes } from '../actions/orderBook.actions';

export interface OrderDisplayProps {
  price: Price;
  size: Size;
  total: Total;
}

interface Base {
  productId: ProductId;
  lastVisibleIndexes: {
    asksIndex: number;
    bidsIndex: number;
  };
}

interface NeverLoaded extends Base {
  type: 'NeverLoaded';
}
interface ConnectedWaitingForData extends Base {
  type: 'ConnectedWaitingForData';
}

interface Connected extends Base {
  type: 'Connected';
  asks: Order[];
  bids: Order[];

  productId: ProductId;
  numLevels: number;
}

interface Disconnected extends Omit<Connected, 'type'> {
  type: 'Disconnected';
}

export type OrderBookState =
  | NeverLoaded
  | ConnectedWaitingForData
  | Connected
  | Disconnected;

const initialState: OrderBookState = {
  type: 'NeverLoaded',
  productId: 'PI_XBTUSD',
  lastVisibleIndexes: {
    asksIndex: 10,
    bidsIndex: 10,
  },
};

const asksSortingMethod: (orderA: Order, orderB: Order) => number = (
  [priceA],
  [priceB]
) => priceA - priceB;
const bidsSortingMethod: (orderA: Order, orderB: Order) => number = (
  [priceA],
  [priceB]
) => priceB - priceA;

const handleSnapshotReceived = (
  { payload }: SnapshotReceived,
  prevState: OrderBookState
): OrderBookState => ({
  ...prevState,
  type: 'Connected',
  numLevels: payload.numLevels,
  productId: payload.product_id,
  asks: payload.asks.sort(asksSortingMethod),
  bids: payload.bids.sort(bidsSortingMethod),
});

const handleDataUpdate = (
  { payload }: DataUpdate,
  prevState: OrderBookState
): OrderBookState => {
  assert(prevState.type === 'Connected');

  return {
    ...prevState,
    asks: mergeSortedOrdersAndFilterZeroSize(
      prevState.asks,
      payload.asks.sort(asksSortingMethod),
      'asc'
    ),
    bids: mergeSortedOrdersAndFilterZeroSize(
      prevState.bids,
      payload.bids.sort(bidsSortingMethod),
      'desc'
    ),
  };
};

const handleUpdateLastVisibleIndexChange = (
  type: 'bidsIndex' | 'asksIndex',
  index: number,
  prevState: OrderBookState
): OrderBookState => {
  return {
    ...prevState,
    lastVisibleIndexes: {
      ...prevState.lastVisibleIndexes,
      [type]: index,
    },
  };
};

const _orderBookReducer = (
  previousState: OrderBookState,
  action: OrderBookActions
): OrderBookState => {
  switch (action.type) {
    case OrderBookActionTypes.OpenStream:
      console.debug('open');
      return previousState;
    case OrderBookActionTypes.CloseStream:
      console.debug('close');
      return previousState;
    case OrderBookActionTypes.SnapshotReceived:
      return handleSnapshotReceived(action, previousState);
    case OrderBookActionTypes.DataUpdate:
      // updateCounter();
      return handleDataUpdate(action, previousState);
    case OrderBookActionTypes.SocketConnected:
    case OrderBookActionTypes.SocketDisconnected:
      console.debug(action.type);
      return previousState;
    case OrderBookActionTypes.UpdateBidsLastVisibleIndex:
      return handleUpdateLastVisibleIndexChange(
        'bidsIndex',
        action.index,
        previousState
      );
    case OrderBookActionTypes.UpdateAsksLastVisibleIndex:
      return handleUpdateLastVisibleIndexChange(
        'asksIndex',
        action.index,
        previousState
      );
    case OrderBookActionTypes.SetCurrentProductId:
      return {
        ...previousState,
        productId: action.productId,
      };
    case OrderBookActionTypes.SwitchContract:
    case OrderBookActionTypes.UnsupportedBackendResponse:
    case OrderBookActionTypes.InfoReceived:
    case OrderBookActionTypes.SubscribeConfirmationReceived:
      return previousState;
  }
};

export const orderBookReducer: Reducer<OrderBookState, OrderBookActions> = (
  previousState: OrderBookState = initialState,
  action: OrderBookActions
) => _orderBookReducer(previousState, action) ?? initialState;
