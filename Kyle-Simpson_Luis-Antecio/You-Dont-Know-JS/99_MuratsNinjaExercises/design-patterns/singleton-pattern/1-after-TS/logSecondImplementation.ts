// (6) import the instance of the singleton
import logger from "./fancyLogger";
// (7) do not instantiate anything
// const logger = new FancyLogger();

export default function logSecondImplementation() {
  logger.printLogCount();
  logger.log("Second file");
  logger.printLogCount();
}
