import { removeDuplicates } from "./removeDuplicates";
import { _ } from "lodash";

test("Should remove duplicates", () => {
  expect(removeDuplicates([1, 2, 3, 1, 5, 6])).toEqual([1, 2, 3, 5, 6]);
});

// https://lodash.com/docs/4.17.15#uniqBy
test("lodash uniq", () => {
  expect(_.uniq([1, 2, 3, 1, 5, 6])).toEqual([1, 2, 3, 5, 6]);
});
