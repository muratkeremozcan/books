
// since process is defined in the index.d.ts declaration file, TS is not complaining
process.exit(); 

process.exitWithLogging = function () {
  console.log('exiting');
  process.exit.apply(process, arguments);
}

process.exitWithLogging();


foo = 123;
