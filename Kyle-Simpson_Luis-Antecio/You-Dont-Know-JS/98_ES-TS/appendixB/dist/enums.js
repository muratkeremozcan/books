//Numeric enums
/*const enum Action{
 buy,  // 0
 sell  // 1
 }*/
class Order {
    constructor(orderId, stock, shares, action) {
        this.orderId = orderId;
        this.stock = stock;
        this.shares = shares;
        this.action = action;
    }
}
function placeOrder(ord) {
    console.log(`Sending to NASDAQ the order to ${ord.action} ${ord.shares} shares of ${ord.stock}`);
}
let order1 = new Order(1, 'IBM', 100, "BUY" /* buy */);
let order2 = new Order(2, 'AAPL', 100, "SELL" /* sell */);
placeOrder(order1);
placeOrder(order2);
