require('../../steps/init')
const given = require('../../steps/given')
const fs = require('fs')
const chance = require('chance').Chance()

const template = fs
  .readFileSync('./mapping-templates/hydrateFollowers.request.vtl', 'utf8')
  .replace('${UsersTable}', 'UsersTable')

test('Should short circuit if prev.result.relationships is empty', async () => {
  const context = {
    prev: {
      result: {
        relationships: []
      }
    }
  }
  
  const result = await given.a_simulated_appsync_template(template, context)
  expect(result).toMatchObject({
    profiles: []
  })
})

test('Should convert relationships to BatchGetItem keys', async () => {
  const userId = chance.guid()
  const otherUserId = chance.guid()
  const context = {
    prev: {
      result: {
        relationships: [{
          userId,
          sk: `FOLLOWS_${otherUserId}`,
          otherUserId
        }]
      }
    }
  }
  
  const result = await given.a_simulated_appsync_template(template, context)
  expect(result).toMatchObject({
    tables: {
      "UsersTable": {
        keys: [{
          id: {
            S: userId
          }
        }],
        consistentRead: false
      }
    }
  })
})