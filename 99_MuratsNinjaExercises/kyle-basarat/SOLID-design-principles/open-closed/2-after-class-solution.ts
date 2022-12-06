// Solution: refactor into smaller parts (1 class or function per responsibility)
// note: Kyle's solution uses classes to break apart the main function

{
  // (2) the main fn is open for any new kind of data,
  // if there is a new type of data we create a class for it
  // (but we also have to shape the data (questions) into a classes, which I don't like)

  class BooleanQuestion {
    constructor(public description: string) {}
    printQuestionChoices() {
      return `${this.description} 1. True 2. False`;
    }
  }

  class MultipleChoiceQuestion {
    constructor(public description: string, public options: string[]) {}
    printQuestionChoices() {
      const topLangs = this.options.map(
        (option, index) => `${index + 1}. ${option}`
      );
      return `${this.description} ${topLangs.join(" ")}`;
    }
  }

  class TextQuestion {
    constructor(public description: string) {}
    printQuestionChoices() {
      return `${this.description} Answer:_________`;
    }
  }

  class RangeQuestion {
    constructor(public description: string) {}
    printQuestionChoices() {
      return `${this.description} Minimum:_________ Maximum:_________`;
    }
  }

  type Question =
    | BooleanQuestion
    | MultipleChoiceQuestion
    | TextQuestion
    | RangeQuestion;

  // (3) if there is a new type of data, add it here
  const questions: Question[] = [
    new BooleanQuestion("Is this useful?"),
    new MultipleChoiceQuestion("What is the best programming language?", [
      "JavaScript",
      "TypeScript",
      "Python",
      "Ruby",
    ]),
    new TextQuestion("What is your favorite JS feature?"),
    new RangeQuestion("What is the speed limit in your city?"),
  ];

  // (1) the fn is closed for modification, only does the printing now
  const printQuiz = (questions: Question[]) =>
    questions.map((question) => question.printQuestionChoices());

  printQuiz(questions); //?
}
