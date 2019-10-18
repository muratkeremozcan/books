0import { Subject } from 'rxjs';
import { flatMap } from 'rxjs/operators';

enum Action {
  Buy = 'BUY',
  Sell = 'Sell'
}

class Order {
  constructor(public orderId: number, public traderId: number,
    public stock: string, public shares: number, public action: Action) { }
}

let traders$ = new Subject<Trader>(); // declares the subject for traders

class Trader {
  orders$ = new Subject<Order>(); // each trader has its own Subject for orders
  
  constructor(private traderId: number, public traderName: string) { }
}
let tradersSubscriber = traders$.subscribe(trader => {
  console.log(`Trader ${trader.traderName} arrived`);
});


let ordersSubscriber = traders$.pipe( // starts with the outer observable traders$
  flatMap(trader => trader.orders$)) // extracts the inner observable from each Trader instance
  .subscribe(ord => { // receives a stream of orders
    console.log(`Got order from trader ${ord.traderId}to ${ord.action} ${ord.shares} shares of ${ord.stock}`);
  });

let firstTrader = new Trader(1, 'Joe');
let secondTrader = new Trader(2, 'Mary')

traders$.next(firstTrader); 
traders$.next(secondTrader);

let order1 = new Order(1,1,'IBM',100,Action.Buy);
let order2 = new Order(2,1,'AAPL',200,Action.Sell);
let order3 = new Order(3,2,'MSFT',500,Action.Buy);

// // Traders place orders
firstTrader.orders$.next(order1);
firstTrader.orders$.next(order2);
secondTrader.orders$.next(order3);