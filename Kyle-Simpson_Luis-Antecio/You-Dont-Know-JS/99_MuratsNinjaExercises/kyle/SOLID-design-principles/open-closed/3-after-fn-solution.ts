// Solution: refactor into smaller parts (1 class or function per responsibility)
// note: this solution uses functions instead of classes
// it breaks apart the main function to a printer and data switcher
// inspired by "convert switch statement cases into an object" (fp-refactoring-Luiz-Alvarez/9-switch.js)

// I prefer this approach because data stays the same, doesn't have to become a class

{
  type Question = {
    type: string;
    description: string;
    options?: string[];
  };

  const questions: Question[] = [
    {
      type: "boolean",
      description: "Is this useful?",
    },
    {
      type: "multipleChoice",
      description: "What is the best programming language?",
      options: ["JavaScript", "TypeScript", "Python", "Ruby"],
    },
    {
      type: "text",
      description: "What is your favorite JS feature?",
    },
    // (1) if need new data
    {
      type: "range",
      description: "What is the speed limit in your city?",
    },
  ];

  // (2) the main fn is open for any new kind of data,
  // if there is a new type of data we create a new function for it
  const booleanQChoices = (description: string): string =>
    `${description} 1. True 2. False`;

  const multipleChoiceQChoices = (
    description: string,
    options: string[]
  ): string => {
    const topLangs = options.map(
      (option, index): string => `${index + 1}. ${option}`
    );
    return `${description} ${topLangs.join(" ")}`;
  };

  const textQChoices = (description: string): string =>
    `${description} Answer:__`;

  const rangeQChoices = (description: string): string =>
    `${description} Minimum:__ Maximum:__`;

  // (3) if there is new type of data, we add it to the data switcher
  const quizes = {
    boolean: booleanQChoices,
    multipleChoice: multipleChoiceQChoices,
    text: textQChoices,
    range: rangeQChoices,
  };

  // (1) the fn is closed for modification, only does the printing now
  const printQuiz = (questions: Question[]): string[] =>
    questions.map((question: Question): string =>
      quizes[question.type](question.description, question.options)
    );

  printQuiz(questions); //?
}
