require("../../steps/init");
const given = require("../../steps/given");
const fs = require("fs");
const chance = require("chance").Chance();

const template = fs.readFileSync(
  "./mapping-templates/getFollowers.response.vtl",
  "utf8"
);

jest.setTimeout(10000);

test.each([null, undefined, ""])(
  "Should default the nextToken",
  async (nextToken) => {
    const context = {
      result: {
        items: [],
        nextToken,
      },
    };

    const result = await given.an_evaluated_appsync_template(template, context);
    expect(result).toMatchObject({
      relationships: [],
      nextToken: null,
    });
  }
);

test("Should compile correctly", async () => {
  const userId = chance.guid();
  const otherUserId = chance.guid();
  const createdAt = new Date().toJSON();
  const context = {
    result: {
      items: [
        {
          userId,
          sk: `FOLLOWS_${otherUserId}`,
          otherUserId,
          createdAt,
        },
      ],
    },
  };

  const result = await given.an_evaluated_appsync_template(template, context);
  expect(result).toMatchObject({
    relationships: context.result.items,
    nextToken: null,
  });
});
