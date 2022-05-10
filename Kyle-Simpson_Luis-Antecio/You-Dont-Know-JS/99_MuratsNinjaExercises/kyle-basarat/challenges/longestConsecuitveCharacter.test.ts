import { longestConsecutiveCharacter } from "./longestConsecutiveCharacter";

test("longestConsecutiveCharacter", () => {
  expect(longestConsecutiveCharacter("A")).toBe("A");
  expect(longestConsecutiveCharacter("AAB")).toBe("A");
  expect(longestConsecutiveCharacter("AAAABBBCCCCCC")).toBe("C");
  expect(longestConsecutiveCharacter("FooBarBaa")).toBe("o");
  expect(longestConsecutiveCharacter("🌹👍👍🌹🌹👍👍🌹🌹🌹👍")).toBe("🌹");
  expect(longestConsecutiveCharacter("")).toBe("");
});
