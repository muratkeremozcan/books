// problem: entity A depends on the api of B;  A  --->  B
// solution: add an intermediate piece that is compatible with any external api so that A never has to change
// A ---> X, Y, Z <---- B, C, D

{
  class Store {
    constructor(
      public paymentProcessor: StripePaymentProcessor | PaypalPaymentProcessor
    ) {}

    // (3) in A, we only use the intermediate X
    // TL, DR; it's a refactor of what was in A to an external interface with wrappers per an external api
    purchaseBike(quantity: number) {
      return this.paymentProcessor.pay(200 * quantity);
    }

    purchaseHelmet(quantity: number) {
      return this.paymentProcessor.pay(15 * quantity);
    }
  }

  // (2)  we insert an intermediate X, and it includes wrappers per external apis
  class StripePaymentProcessor {
    stripe: Stripe;
    constructor(public user: string) {
      this.stripe = new Stripe(user);
    }

    // KEY: the constructors and method implementations may be different between the wrappers
    // but the method signatures need to be uniform
    pay(amountInDollars: number) {
      return this.stripe.makePayment(amountInDollars * 100);
    }
  }

  class PaypalPaymentProcessor {
    paypal: Paypal;
    constructor(public user: string) {
      this.paypal = new Paypal();
    }

    pay(amountInDollars: number) {
      return this.paypal.makePayment(this.user, amountInDollars);
    }
  }

  // (1) the apis B and C stay exactly the same
  class Stripe {
    constructor(public user: string) {}

    makePayment(amountInCents: number) {
      return `${this.user} paid ${amountInCents / 100} with Stripe`;
    }
  }

  class Paypal {
    makePayment(user: string, amountInDollars: number) {
      return `${user} paid ${amountInDollars} with Paypal`;
    }
  }

  const storeStripe = new Store(new StripePaymentProcessor("John"));
  storeStripe.purchaseBike(2); //?
  storeStripe.purchaseHelmet(2); //?

  const storePaypal = new Store(new PaypalPaymentProcessor("John"));
  storePaypal.purchaseBike(2); //?
  storePaypal.purchaseHelmet(2); //?
}
