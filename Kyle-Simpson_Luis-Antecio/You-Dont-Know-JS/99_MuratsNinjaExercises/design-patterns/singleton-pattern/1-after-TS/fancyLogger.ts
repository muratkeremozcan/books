// (1) do not export the class, because we just want to use a single instance of it

class FancyLogger {
  // (2.0) use the static keyword for the instance
  static instance: any;
  logs: any[];

  constructor() {
    // (2.1) we do not need any logic when using the static keyword
    // if (FancyLogger.instance == null) {
    this.logs = [];
    FancyLogger.instance = this;
    // }
    // return FancyLogger.instance;
  }

  log(message) {
    this.logs.push(message);
    console.log(`FANCY: ${message}`);
  }

  printLogCount() {
    console.log(`${this.logs.length} Logs`);
  }
}

// (3) create the instance before we export the class
const logger = new FancyLogger();
// (4) we do not need to freeze the instance when using the static keyword
// Object.freeze(logger);
// (5) export the instance of the class
export default logger;
