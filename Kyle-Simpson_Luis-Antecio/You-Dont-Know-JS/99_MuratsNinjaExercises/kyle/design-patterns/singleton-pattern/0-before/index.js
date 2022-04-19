import logFirstImplementation from "./logFirstImplementation";
import logSecondImplementation from "./logSecondImplementation";

// https://youtu.be/sJ-c3BA-Ypo
// problem: we want the 2 files to share the log state,
// but they each instantiate their own FancyLogger
logFirstImplementation();
logSecondImplementation();
