import type { Brand } from './util.types';

type Feed = 'book_ui_1';
type FeedSnapshot = 'book_ui_1_snapshot';
export type ProductId = 'PI_XBTUSD' | 'PI_ETHUSD';
export type Coin = 'BTC' | 'ETH';
export type Price = Brand<number, 'price'>;
export type Size = Brand<number, 'size'>;
export type Total = Brand<number, 'total'>;

export interface Message {
  event: 'subscribe' | 'unsubscribe';
  feed: Feed;
  product_ids: ProductId[];
}

export interface InfoResponse {
  event: 'info';
  version: number;
}

export interface SubscribeResponse {
  event: 'subscribed';
  feed: Feed;
  product_ids: ProductId[];
}

interface BaseFeedResponse {
  asks: [Price, Size][];
  bids: [Price, Size][];
  product_id: ProductId;
}

export interface SnapshotResponse extends BaseFeedResponse {
  feed: FeedSnapshot;
  numLevels: number;
}

export interface DataResponse extends BaseFeedResponse {
  feed: Feed;
}

export type OrderBookResponse =
  | InfoResponse
  | SubscribeResponse
  | SnapshotResponse
  | DataResponse;

export type OrderBookMessage = Message | OrderBookResponse;
