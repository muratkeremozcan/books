/**
 *  RxJS in Action
 *  Listing 6.9 and 6.10
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

// assume you have transactions in a DB and you want to add timestamps to each transaction

 class Transaction {
  constructor(name, type, amount, from, to = null) {
     this.name = name;
     this.type = type;
     this.from = from;
     this.to   = to;
     this.amount = amount;
  }

  name() {
    return this.name;
  }

  from() {
    return this.from;
  }

  to() {
    return this.to;
  }

  amount() {
    return this.amount;
  }

  type() {
    return this.type;
  }
}

function getTransactionsArray() {
  return [
   new Transaction('Brendan Eich', 'withdraw', 500, 'checking'),
   new Transaction('George Lucas', 'deposit',  800, 'savings'),
   new Transaction('Emmet Brown', 'transfer', 2000, 'checking', 'savings'),
   new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
  ];
}

const txDb = new PouchDB('transactions');
const accountsDb = new PouchDB('accounts');

/** performs the database operation */
const writeTx$ = tx => Rx.Observable.of(tx)
  .timestamp() // attaches a timestamp to each emitted item
  .map(obj => Object.assign({}, obj.value, { // create a copy of the transaction object
                date: obj.timestamp // add the timestamp to the object
              })
   )
  .do(tx => console.log(`Processing transaction for: ${tx.name}`))
  .mergeMap(datedTx => Rx.Observable.fromPromise(txDb.post(datedTx)));
  // posts the object into the database by wrapping PouchDB.post() operation with an observable
  // because the call to post() returns a Promise, which you convert to an observable, 
  // you use mergeMap() to flatten the projected observable.



Rx.Observable.from(getTransactionsArray()) // read the transaction objects from a local array
  .concatMap(writeTx$) // join the streams to process and create the new transaction document
  .subscribe(
    rec => console.log(`New record created: ${rec.id}`),
    err => console.log('Error: ' + err),
    ()  => console.log('Database populated!')
  );


Rx.Observable.from(getTransactionsArray())
  .concatMap(writeTx$)
  .subscribe(
    rec => console.log(`New record created: ${rec.id}`),
    err => console.log('Error: ' + err),
    ()  => console.log('Database populated!')
  );
