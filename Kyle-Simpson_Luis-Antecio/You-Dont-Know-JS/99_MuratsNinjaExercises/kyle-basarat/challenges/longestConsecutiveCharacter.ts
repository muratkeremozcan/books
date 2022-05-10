/**
 * Given a string, returns the maximum consecutive repeating character in string.
 * Examples:
 *  'AAAABBBCCCCCCAAAA' => 'C'
 *  'FooBarBaa' => 'o'
 *  '🌹👍👍🌹🌹👍👍🌹🌹🌹👍' => '🌹'
 */
export function longestConsecutiveCharacter(input: string): string {
  let longest = { char: "", count: 0 };
  let current = { char: "", count: 0 };

  for (let char of input) {
    if (char === current.char) current.count++;
    else {
      current = { char, count: 1 };
    }

    if (current.count > longest.count) {
      longest = { ...current };
    }
  }

  return longest.char;
}
