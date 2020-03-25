// you can declare a global variable as such
declare var foo: any;

// Interfaces allow other people to extend the nature of these global variables 
// while still telling TypeScript about such modifications
interface Process {
  exit(code?: number): void;
}
declare var process: Process;

interface Process {
  exitWithLogging(code?: number): void;
}
