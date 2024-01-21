import {flow} from 'fp-ts/function'
import {fromNullable, fold, none, some, type Option} from 'fp-ts/Option'
import {curry, pipe} from 'ramda'

// no Maybe in fp-ts, we have Option, which is similar to swan-io Option

type Account = {balance: number}

// updateLedger :: Account -> Account
const updateLedger = (account: Account) => account
// remainingBalance :: Account -> String
const remainingBalance = ({balance}: Account) => `Your balance is $${balance}`
// finishTransaction :: Account -> String (pipe from ramda is the same as flow from fp-ts)
const finishTransaction = pipe(updateLedger, remainingBalance)

// withdraw :: Number -> Account -> Maybe(Account)
const withdraw = curry(
  (amount: number, {balance}: Account): Option<Account> =>
    // balance >= amount ? some({balance: balance - amount}) : none,
    fromNullable({balance: balance - amount}), // easier with fromNullable
  // Option.fromNullable(balance >= amount ? {balance: balance - amount} : null) // in swan-io Option
  // Maybe.of(balance >= amount ? {balance: balance - amount} : null), // with traditional Maybe
)

// getTwenty :: Account -> String
const getTwenty = flow(
  withdraw(20),
  fold(() => "You're broke!", finishTransaction),
  // maybe("You're broke!", finishTransaction) // comparison with traditional Maybe
)

getTwenty({balance: 200.0}) //?

getTwenty({balance: 10.0}) //?
