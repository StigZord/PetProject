import type { Reducer } from 'redux';
import type { OrderBookActions } from '../actions/orderBook.actions';
import { OrderBookActionTypes } from '../actions/orderBook.actions';

export interface OrderBookState {
  //
}

const initialState: OrderBookState = {};

export const orderBookReducer: Reducer<OrderBookState, OrderBookActions> = (
  state: OrderBookState = initialState,
  action: OrderBookActions
) => {
  switch (action.type) {
    case OrderBookActionTypes.OpenStream:
      console.debug('open');
      return {};
    case OrderBookActionTypes.CloseStream:
      console.debug('close');
      return {};
    case OrderBookActionTypes.NewContent:
      console.debug('newContent', action.payload);
      return {};
    case OrderBookActionTypes.SocketConnected:
    case OrderBookActionTypes.SocketDisconnected:
      console.debug(action.type);
      return state;
    default:
      return state;
  }
};
