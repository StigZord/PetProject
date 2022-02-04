import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import type { OrderBookActions } from './actions/orderBook.actions';
import type { OrderBookState } from './reducers/orderBook.reducer';
import { rootEpic, rootReducer } from './root';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export interface AppState {
  orderBook: OrderBookState;
}

const epicMiddleware = createEpicMiddleware<
  OrderBookActions,
  OrderBookActions,
  AppState
>();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(epicMiddleware))
);

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
