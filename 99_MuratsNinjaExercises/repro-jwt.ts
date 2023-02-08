import * as jwt from 'jsonwebtoken'
import {v4 as uuid} from 'uuid'
import {faker} from '@faker-js/faker/locale/en'

const defaults = {
  user: {
    email: faker.internet.exampleEmail(),
    // firstName: faker.name.firstName(),
    // lastName: faker.name.lastName(),
    // accountId: uuid(),
  },
  // secret: 'TEST',
  // expiresIn: '3m', // sets default token expiry to 3 minutes, which should be enough for most tests.
  // sub: uuid(),
}
// const {user} = Cypress._.merge(defaults, {})

jwt.sign(
  {
    // ...user,
    // jti: uuid(),
  },
  'secret',
  // {
  // algorithm: 'RS256',
  // allowInsecureKeySizes: true,
  //   expiresIn,
  //   subject: sub,
  // },
)
