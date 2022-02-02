export const enum OrderBookActionTypes {
  OpenStream = 'OpenStream',
  CloseStream = 'CloseStream',
  SocketConnected = 'SocketConnected',
  SocketDisconnected = 'SocketDisconnected',
  NewContent = 'NewContent',
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

export interface NewContent {
  type: OrderBookActionTypes.NewContent;
  payload: any;
}

export type OrderBookActions =
  | OpenStream
  | CloseStream
  | SocketConnected
  | SocketDisconnected
  | NewContent;
