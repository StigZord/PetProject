import type {
  DataResponse,
  InfoResponse,
  OrderBookMessage,
  SnapshotResponse,
  SubscribeResponse,
} from './orderBook.types';

export const isInfo = (
  response: OrderBookMessage
): response is InfoResponse => {
  return 'event' in response && response.event === 'info';
};

export const isSubscribe = (
  response: OrderBookMessage
): response is SubscribeResponse => {
  return 'event' in response && response.event === 'subscribed';
};

export const isSnapshotResponse = (
  response: OrderBookMessage
): response is SnapshotResponse => {
  // TODO: This guard feels little unreliable, since I believe there could
  // be more feed types in real life example
  return 'feed' in response && response.feed === 'book_ui_1_snapshot';
};

export const isDataResponse = (
  response: OrderBookMessage
): response is DataResponse => {
  // TODO: This guard feels little unreliable, since I believe there could
  // be more feed types in real life example
  return (
    !('event' in response) &&
    'feed' in response &&
    response.feed === 'book_ui_1'
  );
};
