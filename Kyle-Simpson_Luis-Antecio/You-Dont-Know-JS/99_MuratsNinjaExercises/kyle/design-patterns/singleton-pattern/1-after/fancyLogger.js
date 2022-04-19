// (1) do not export the class, because we just want to use a single instance of it

class FancyLogger {
  constructor() {
    // (2) lock down a single instance
    // we only want to return the single instance
    // instead of returning a new instance every time we call the constructor
    // (in TS we would just use static class and not need this)
    if (FancyLogger.instance == null) {
      this.logs = [];
      FancyLogger.instance = this;
    }
    return FancyLogger.instance;
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
// (4) make sure it cannot change (in TS we would just use static class and not need this)
Object.freeze(logger);
// (5) export the instance of the class
export default logger;
