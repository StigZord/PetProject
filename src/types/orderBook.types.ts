import type { Brand } from './util.types';

type Feed = 'book_ui_1';
type FeedSnapshot = 'book_ui_1_snapshot';
export type ProductId = 'PI_XBTUSD' | 'PI_ETHUSD';
export type Coin = 'BTC' | 'ETH';
export type Price = Brand<number, 'price'>;
// export type PriceFormatted = Brand<string, 'priceFormatted'>;
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

export type Order = [Price, Size];

interface BaseResponse {
  asks: Order[];
  bids: Order[];
  product_id: ProductId;
}

export interface SnapshotResponse extends BaseResponse {
  feed: FeedSnapshot;
  numLevels: number;
}

export interface DeltaResponse extends BaseResponse {
  feed: Feed;
}

export type OrderBookResponse =
  | InfoResponse
  | SubscribeResponse
  | SnapshotResponse
  | DeltaResponse;

export type OrderBookMessage = Message | OrderBookResponse;
