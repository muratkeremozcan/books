// https://dev.to/noriste/routemanager-ui-coding-patterns-typescript-42hb Stefano's notes part4

// ❌ don't
{
  type Proof = {
    name: string
  }
  type Location = {
    longitude: number
    latitude: number
  }
  type Order = {
    status: 'ready' | 'inProgress' | 'complete'
    name: string
    at?: Location
    expectedDelivery?: Date
    deliveredAt?: Date
    proofOfDeliveries?: Proof[]
  }

  function getEmailMessage(order: Order) {
    if (order.at) {
      return `${order.name} is at ${order.at}`
    }
    if (order.expectedDelivery) {
      return `${order.name} will be delivered ${order.expectedDelivery}`
    }
    if (order.deliveredAt) {
      return `${order.name} has been delivered at ${order.deliveredAt}`
    }
  }
}

// ✅ do
{
  type Proof = {
    name: string
  }
  type Location = {
    longitude: number
    latitude: number
  }

  type Order = {
    name: string
  } & (
    | {
        status: 'ready'
        at: Location
      }
    | {
        status: 'inProgress'
        expectedDelivery: Date
      }
    | {
        status: 'complete'
        deliveredAt: Date
        proofOfDeliveries: Proof[]
      }
  )

  function getEmailMessage(order: Order) {
    switch (order.status) {
      case 'ready':
        return `${order.name} is at ${order.at}`

      case 'inProgress':
        return `${order.name} will be delivered ${order.expectedDelivery}`

      case 'complete':
        return `${order.name} has been delivered at ${order.deliveredAt}`
    }
  }
}

{
  type Order = {
    customer: Customer
    state: OrderState
    productName: string
    price: number
    quantity: number
  }

  type Customer = {
    name: string
    contactInfo: ContactInfo
  }

  type ContactInfo =
    | {kind: 'emailOnly'; email: string}
    | {kind: 'postalOnly'; address: string}
    | {kind: 'emailAndPostal'; email: string; address: string}

  type PaidOrderData = {paymentDate: Date; amount: number}
  type SentOrderData = {sendingDate: Date}
  type DeliveredOrderData = {deliveryDate: Date}

  type OrderState =
    | {kind: 'new'}
    | {kind: 'paid'; paidData: PaidOrderData}
    | {kind: 'sent'; paidData: PaidOrderData; sentData: SentOrderData}
    | {
        kind: 'delivered'
        data: PaidOrderData
        sentData: SentOrderData
        deliveredData: DeliveredOrderData
      }
}

// state machine example
// ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1uhm4qm67u55rauuzrpc.png)
// empty - fetching has not started yet or has been canceled
// loading - fetching is in progress
// withData - fetching was successful
// error - fetching failed

{
  type State =
    | {type: 'empty'}
    | {type: 'loading'}
    | {type: 'withData'; data: string[]}
    | {type: 'error'; errorMessage: string}

  type Action =
    | {type: 'dataRequested'}
    | {type: 'dataFetchingSucceeded'; data: string[]}
    | {type: 'dataFetchingFailed'; errorMessage: string}
    | {type: 'dataFetchingCancelled'}

  function reducer(prevState: State, action: Action): State {
    switch (prevState.type) {
      case 'loading':
        switch (action.type) {
          case 'dataFetchingSucceeded':
            return {type: 'withData', data: action.data}
          case 'dataFetchingCancelled':
            return {type: 'empty'}
          case 'dataFetchingFailed':
            return {type: 'error', errorMessage: action.errorMessage}
          case 'dataRequested':
            return prevState
        }
      case 'empty':
      case 'error':
      case 'withData':
        switch (action.type) {
          case 'dataRequested':
            return {type: 'loading'}
          case 'dataFetchingCancelled':
          case 'dataFetchingFailed':
          case 'dataFetchingSucceeded':
            return prevState
        }
    }
  }
}

// another state machine example
// ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x9gnsx1avn2sz48qi668.png)

{
  type TurnstileState = 'Locked' | 'Unlocked'

  type Action = 'Push' | 'InsertCoin'

  function reducer(state: TurnstileState, action: Action) {
    switch (state) {
      case 'Locked':
        switch (action) {
          case 'Push':
            return 'Locked'
          case 'InsertCoin':
            return 'Unlocked'
        }
      case 'Unlocked':
        switch (action) {
          case 'Push':
            return 'Locked'
          case 'InsertCoin':
            return 'Unlocked'
        }
    }
  }
}

//  discriminated union representing a binary tree
{
  type Tree =
    | {type: 'empty'}
    | {type: 'leaf'; value: number}
    | {type: 'node'; left: Tree; right: Tree}

  function toString(tree: Tree): string {
    switch (tree.type) {
      case 'empty':
        return 'Empty'
      case 'leaf':
        return `Leaf(${tree.value})`
      case 'node':
        return `Node(${toString(tree.left)}, ${toString(tree.right)}})`
    }
  }
}
// class version (omg..)
{
  abstract class Tree {
    abstract toString(): string
  }

  class Empty extends Tree {
    toString() {
      return `Empty`
    }
  }

  class Leaf extends Tree {
    constructor(private value: number) {
      super()
    }

    toString() {
      return `Leaf(${this.value})`
    }
  }

  class Node extends Tree {
    constructor(private left: Tree, private right: Tree) {
      super()
    }

    toString() {
      return `Node(${this.left.toString()}, ${this.right.toString()}})`
    }
  }
}
