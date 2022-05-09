/**
 * Given an @param input string, and an opening parenthesis @param openingIndex,
 *   return the corresponding closing parenthesis index if any (or return `null`)
 * Example:
 *  `Betty (had (a bit) of butter (but the (butter))) was bitter`
 *   input ^                          should return ^
 */
export function getClosingParenthesis(
  input: string,
  openingIndex: number
): number | null {
  if (openingIndex < 0 || openingIndex >= input.length) {
    throw new Error("Out of bounds opening index");
  }
  if (input[openingIndex] != "(") {
    throw new Error("No parenthesis at opening index");
  }

  let nestedOpened = 0;
  for (let index = openingIndex + 1; index < input.length; index++) {
    const char = input[index];
    char; //?

    // if we find a new ( , this must be the opening of a nested parenthesis)
    // we need to increment the nested
    if (char === "(") {
      nestedOpened++;
    }
    // if we instead find a ), this most be the original closing )
    else if (char === ")") {
      // if we are at 0, we never incremented the nested (, so we found the original closing )
      if (nestedOpened === 0) {
        return index;
      }
      // if we are not at 0, we must have been incrementing the nested (, so we decrement/close-off)
      nestedOpened--;
    }
  }

  return null;
}

// https://www.youtube.com/watch?v=fU0Ov_bHDmA&t=22s
