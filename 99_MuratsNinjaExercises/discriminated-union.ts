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
