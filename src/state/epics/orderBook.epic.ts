import { ofType } from 'redux-observable';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import type {
  CloseStream,
  NewContent,
  OpenStream,
  OrderBookActions,
  SocketConnected,
  SocketDisconnected,
} from '../actions/orderBook.actions';
import { OrderBookActionTypes } from '../actions/orderBook.actions';

const subscribeMessage = {
  event: 'subscribe',
  feed: 'book_ui_1',
  product_ids: ['PI_XBTUSD'],
};

const url = 'wss://www.cryptofacilities.com/ws/v1';
const openObserver = new Subject<Event>();
const closeObserver = new Subject<CloseEvent>();

let socket$: WebSocketSubject<any>;

const connectEpic = (
  action$: Observable<OrderBookActions>
): Observable<SocketConnected | SocketDisconnected | NewContent> =>
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

      socket$ = webSocket<any>({
        url,
        openObserver,
        closeObserver,
      });

      return merge(
        open$,
        close$,
        socket$.pipe(
          map<any, NewContent>((payload) => ({
            type: OrderBookActionTypes.NewContent,
            payload: payload,
          })),
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
      socket$.next(subscribeMessage);
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
