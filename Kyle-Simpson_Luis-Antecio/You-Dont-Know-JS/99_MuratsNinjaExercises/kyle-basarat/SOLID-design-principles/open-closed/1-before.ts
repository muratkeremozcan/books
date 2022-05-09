// problem: (1) what happens when the data changes? we would have to change the function
// which means the function is not closed; it is tightly coupled to the data
// Open Closed Principle: if the data is changing, the function should not have to change;
// the function should be open for / compatible with various kinds of inputs/data, but closed for modification / shouldn't have to change

// note: this is also a case of a violation of single responsibility principle;
// the fn is responsible of 2 things (1) shaping the data (2) printing the data, therefore has 2 reasons to change

// note: when there are too many logic blocks, or switch statements, it smells like a violation of the open-closed principle
// there are 2 ways to deal with it; Kyle's solution with classes, or converting switch statement cases into an object

{
  type Question = { type: string; description: string; options?: string[] };

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

  function printQuiz(questions: Question[]) {
    return questions.map((question) => {
      switch (question.type) {
        case "boolean":
          return `${question.description} 1. True 2. False`;
        case "multipleChoice":
          const topLangs = question.options.map(
            (option, index) => `${index + 1}. ${option}`
          );
          return `${question.description} ${topLangs.join(" ")}`;
        case "text":
          return `${question.description} Answer:_________`;
        // (2) then have to modify the function (bad, not closed)
        case "range":
          return `${question.description} Minimum:_________ Maximum:_________`;
        default:
          return "";
      }
    });
  }

  printQuiz(questions); //?
}
