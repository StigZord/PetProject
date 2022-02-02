import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import { orderBookEpic } from './epics/orderBook.epic';
import { orderBookReducer } from './reducers/orderBook.reducer';

// Note: combining epics is not needed for single epic, but leaving it
// for easier extensibility in the future.
export const rootEpic = combineEpics(orderBookEpic);

// Note: combining reducer is not needed for single reducer, but leaving it
// for easier extensibility in the future.
export const rootReducer = combineReducers({ orderBook: orderBookReducer });
