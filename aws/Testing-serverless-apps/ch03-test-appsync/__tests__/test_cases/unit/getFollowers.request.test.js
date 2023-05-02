require('../../steps/init')
const given = require('../../steps/given')
const fs = require('fs')
const chance = require('chance').Chance()

const template = fs.readFileSync(
  './mapping-templates/getFollowers.request.vtl',
  'utf8')

jest.setTimeout(10000)

test('Should compile correctly', async () => {
  const context = {
    arguments: {
      userId: chance.guid(),
      nextToken: chance.guid(),
      limit: 42
    }
  }

  const result = await given.an_evaluated_appsync_template(template, context)
  expect(result).toMatchObject({
    query: {
      expressionValues: {
        ":userId": {
          S: context.arguments.userId
        },
        ":follows": {
          S: "FOLLOWS_"
        }
      }
    },
    nextToken: context.arguments.nextToken,
    limit: 42
  })
})