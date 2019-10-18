import { Subject } from "rxjs";

// we use TypeScript enums that allow us to define a limited number of constants. 
// Placing the actions to buy or sell inside an enum provides additional type checking to ensure that our script uses only the allowed action
enum Action { // uses enums to declares which actions are allowed
  Buy = 'BUY',
  Sell = 'SELL'
}

class Order { // a class representing an order
  constructor(public orderId: number, public traderId: number, public stock: string, public shares: number, public action:Action) {}
}

const orders$ = new Subject<Order>(); // a subject instance that works only with Order objects

class Trader {
  constructor(private traderId: number, private traderName:string) {}

  placeOrder(order: Order) {
    orders$.next(order) // subject pushes order/data to the subscribers when an order is placed
  }
}

// observable/subject.subscribe(observer);
// observers:
const stockExchange = orders$.subscribe( ord => {
  console.log(`Sending to stock exchange the order to ${ord.action} ${ord.shares} shares of ${ord.stock}`);
});
const tradeComission = orders$.subscribe( ord => {
  console.log(`Reporting to trade comission the order to ${ord.action} ${ord.shares} shares of ${ord.stock} `);
});

const trader = new Trader(1, 'Joe');
// trader //?

const order1 = new Order(1, 1, 'IBM', 100, Action.Buy);
const order2 = new Order(2, 1, 'AAPL', 100, Action.Sell);
// order1//?
// order2//?


trader.placeOrder( order1 ); // subject pushes order/data to the subscribers when an order is placed
trader.placeOrder( order2); 