import { ofType } from 'redux-observable';
import {
  filter,
  map,
  switchMap,
  takeUntil,
  throttleTime,
} from 'rxjs/operators';
import { asyncScheduler, EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import type {
  CloseStream,
  OpenStream,
  OrderBookActions,
  OrderBookBackendActions,
  SocketConnected,
  SocketDisconnected,
} from '../actions/orderBook.actions';
import { OrderBookActionTypes } from '../actions/orderBook.actions';
import type {
  Message,
  OrderBookMessage,
  ProductId,
} from '../../types/orderBook.types';
import {
  isDataResponse,
  isInfo as isInfoResponse,
  isSnapshotResponse,
  isSubscribe as isSubscribeResponse,
} from '../../types/typeGuards';

const getMessage = (
  event: 'subscribe' | 'unsubscribe',
  productId: ProductId
): Message => ({
  event,
  feed: 'book_ui_1',
  product_ids: [productId],
});

const url = 'wss://www.cryptofacilities.com/ws/v1';
const openObserver = new Subject<Event>();
const closeObserver = new Subject<CloseEvent>();
const throttleDuration = 1000;

let socket$: WebSocketSubject<OrderBookMessage>;

const connectEpic = (
  action$: Observable<OrderBookActions>
): Observable<SocketConnected | SocketDisconnected | OrderBookBackendActions> =>
  action$.pipe(
    ofType<OrderBookActions, OrderBookActionTypes.OpenStream, OpenStream>(
      OrderBookActionTypes.OpenStream
    ),
    switchMap(() => {
      const open$ = openObserver.pipe(
        switchMap((event) => {
          console.debug('open', event);
          return of<SocketConnected>({
            type: OrderBookActionTypes.SocketConnected,
          });
        })
      );
      const close$ = closeObserver.pipe(
        map<Event, SocketDisconnected>((event) => {
          console.debug('close', event);
          return { type: OrderBookActionTypes.SocketDisconnected };
        })
      );

      socket$ = webSocket<OrderBookMessage>({
        url,
        openObserver,
        closeObserver,
      });

      return merge(
        open$,
        close$,
        socket$.pipe(
          filter(
            (response) =>
              !isInfoResponse(response) && !isSubscribeResponse(response)
          ),
          // throttleTime(throttleDuration, asyncScheduler, {
          //   leading: true,
          //   trailing: true,
          // }),
          map<OrderBookMessage, OrderBookBackendActions>((payload) => {
            if (isDataResponse(payload)) {
              return { type: OrderBookActionTypes.DataUpdate, payload };
            }

            if (isSnapshotResponse(payload)) {
              return { type: OrderBookActionTypes.SnapshotReceived, payload };
            }

            return {
              type: OrderBookActionTypes.UnsupportedBackendResponse,
            };
          }),
          takeUntil(
            action$.pipe(
              ofType<
                OrderBookActions,
                OrderBookActionTypes.CloseStream,
                CloseStream
              >(OrderBookActionTypes.CloseStream)
            )
          )
        )
      );
    })
  );

const onConnectedEpic = (action$: Observable<OrderBookActions>) =>
  action$.pipe(
    ofType<
      OrderBookActions,
      OrderBookActionTypes.SocketConnected,
      SocketConnected
    >(OrderBookActionTypes.SocketConnected),
    switchMap(() => {
      console.debug('sending message');
      socket$.next(getMessage('subscribe', 'PI_XBTUSD'));
      return EMPTY;
    })
  );

export const orderBookEpic = (
  action$: Observable<OrderBookActions>,
  // TODO
  state$: Observable<any>
): Observable<OrderBookActions> => {
  return merge(connectEpic(action$), onConnectedEpic(action$));
};
