import type {
  DataResponse,
  SnapshotResponse,
} from '../../types/orderBook.types';

export const enum OrderBookActionTypes {
  OpenStream = 'OpenStream',
  CloseStream = 'CloseStream',
  SocketConnected = 'SocketConnected',
  SocketDisconnected = 'SocketDisconnected',
  InfoReceived = 'Info',
  SubscribeConfirmationReceived = 'SubscribeConfirmationReceived',
  SnapshotReceived = 'SnapshotReceived',
  DataUpdate = 'DataUpdate',
  UnsupportedBackendResponse = 'UnsupportedBackendResponse',
}

export interface OpenStream {
  type: OrderBookActionTypes.OpenStream;
}

export interface CloseStream {
  type: OrderBookActionTypes.CloseStream;
}

export interface SocketConnected {
  type: OrderBookActionTypes.SocketConnected;
}

export interface SocketDisconnected {
  type: OrderBookActionTypes.SocketDisconnected;
}

export interface InfoEventReceived {
  type: OrderBookActionTypes.InfoReceived;
}

export interface SubscribeConfirmationReceived {
  type: OrderBookActionTypes.SubscribeConfirmationReceived;
}

export interface SnapshotReceived {
  type: OrderBookActionTypes.SnapshotReceived;
  payload: SnapshotResponse;
}

export interface DataUpdate {
  type: OrderBookActionTypes.DataUpdate;
  payload: DataResponse;
}

export interface UnsupportedBackendResponse {
  type: OrderBookActionTypes.UnsupportedBackendResponse;
}

export type OrderBookBackendActions =
  | InfoEventReceived
  | SubscribeConfirmationReceived
  | SnapshotReceived
  | DataUpdate
  | UnsupportedBackendResponse;

export type OrderBookActions =
  | OpenStream
  | CloseStream
  | SocketConnected
  | SocketDisconnected
  | OrderBookBackendActions;
