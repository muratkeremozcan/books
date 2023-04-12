import * as jwt from 'jsonwebtoken'
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

faker.internet.exampleEmail() //?

jwt.sign(
  {
    // ...user,
    // jti: uuid(),
  } /*  */,
  'secret',
  // {
  // algorithm: 'RS256',
  // allowInsecureKeySizes: true,
  //   expiresIn,
  //   subject: sub,
  // },
)

faker.internet.userName() //?

const dotRegex = /[.]/g
const plusRegex = /[+]/g
const dashRegex = /[-]/g
const underScoreRegex = /[_]/g

const unformatUrlEmail = (email: string): string => {
  return email.replace(dashRegex, '.').replace(underScoreRegex, '+')
}

unformatUrlEmail('merchanttest@test.com') //?
