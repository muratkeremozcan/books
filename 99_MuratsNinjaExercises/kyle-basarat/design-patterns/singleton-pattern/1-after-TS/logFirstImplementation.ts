// (6) import the instance of the singleton
import logger from "./fancyLogger";
// (7) do not instantiate anything
// const logger = new FancyLogger();

export default function logFirstImplementation() {
  logger.printLogCount();
  logger.log("First file");
  logger.printLogCount();
}
