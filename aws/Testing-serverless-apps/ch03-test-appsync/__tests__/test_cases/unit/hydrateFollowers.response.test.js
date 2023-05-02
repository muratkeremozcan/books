require('../../steps/init')
const given = require('../../steps/given')
const fs = require('fs')
const chance = require('chance').Chance()

const template = fs
  .readFileSync('./mapping-templates/hydrateFollowers.response.vtl', 'utf8')
  .replace('${UsersTable}', 'UsersTable')

test('Should compile followers from UsersTable', async () => {
  const context = {
    result: {
      data: {
        "UsersTable": [{
          id: chance.guid(),
          screenName: chance.string({ length: 16 }),
          name: chance.string({ length: 16 }),
          createdAt: new Date().toJSON(),
        }]
      } 
    }
  }

  const result = await given.an_evaluated_appsync_template(template, context)
  expect(result).toMatchObject({
    profiles: context.result.data['UsersTable'],
    nextToken: null
  })
})