// problem: entity A depends on the api of B;  A  --->  B
// solution: add an intermediate piece that is compatible with any external api so that A never has to change
// A ---> X <---- B, C, D

{
  // problem our A is tightly coupled to B, and we want to switch to C
  class Store {
    stripe: Stripe;
    constructor(public user: string) {
      this.stripe = new Stripe(user);
    }

    purchaseBike(quantity: number) {
      return this.stripe.makePayment(200 * quantity * 100);
    }

    purchaseHelmet(quantity: number) {
      return this.stripe.makePayment(15 * quantity * 100);
    }
  }

  // think of this class the api of B, and B only accepts payments in cents
  class Stripe {
    constructor(public user: string) {}

    makePayment(amountInCents: number) {
      return `${this.user} paid ${amountInCents / 100} with Stripe`;
    }
  }

  const store = new Store("John");
  store.purchaseBike(2); //?
  store.purchaseHelmet(2); //?
}

// switching to using C requires major changes in A

{
  class Store {
    // stripe: Stripe;
    paypal: Paypal;
    constructor(public user: string) {
      // this.stripe = new Stripe(user);
      this.paypal = new Paypal();
    }

    purchaseBike(quantity: number) {
      // return this.stripe.makePayment(200 * quantity * 100);
      return this.paypal.makePayment(this.user, 200 * quantity);
    }

    purchaseHelmet(quantity: number) {
      // return this.stripe.makePayment(15 * quantity * 100);
      return this.paypal.makePayment(this.user, 15 * quantity);
    }
  }

  // class Stripe {
  // 	constructor(public user: string) {}

  //   makePayment(amountInCents: number) {
  //     return `${user} paid ${amountInCents / 100} with Stripe`;
  //   }
  // }

  // (1) suppose that we have to switch to C, and C has a different api
  class Paypal {
    makePayment(user: string, amountInDollars: number) {
      return `${user} paid ${amountInDollars} with Paypal`;
    }
  }

  const store = new Store("John");
  store.purchaseBike(2); //?
  store.purchaseHelmet(2); //?
}
