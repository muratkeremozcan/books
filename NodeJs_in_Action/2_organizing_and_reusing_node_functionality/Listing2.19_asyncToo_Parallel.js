/** http://caolan.github.io/async/
 * Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript
 * Async provides around 70 functions that include the usual 'functional' suspects (map, reduce, filter, each…)
 */
const async = require('async');
const exec = require('child_process').exec;

function downloadNodeVersion(version, destination, callback) {
  const url = `http://nodejs.org/dist/v${version}/node-v${version}.tar.gz`;
  const filepath = `${destination}/${version}.tgz`;
  exec(`curl ${url} > ${filepath}`, callback);
}
// will not work on windows
// this will not work on Windows.
// The key here is using async tool for executing the download tasks in parallel, then creating an archive (task in sequence) file after the downloads finish
async.series([ // http://caolan.github.io/async/docs.html#series, Run the functions in the tasks collection in series, each one running once the previous function has completed
  callback => {
    async.parallel([ // http://caolan.github.io/async/docs.html#parallel, Run the tasks collection of functions in parallel, without waiting until the previous function has completed
      callback => {
        console.log('Downloading Node v4.4.7...');
        downloadNodeVersion(('4.4.7'), '/tmp', callback);
      },
      callback => {
        console.log('Downloading Node v6.3.0....');
        downloadNodeVersion(('6.3.0'), '/tmp', callback);
      }
    ], callback); // Async.parallel : Once the tasks have completed, the results are passed to the final callback as an array
  },
  callback => { // creates an archive file
    console.log('Creating archive of downloaded files...');
    exec(
      'tar cvf node_distros.tar /tmp/4.4.7.tgz /tmp/6.3.0.tgz',
      err => {
        if (err) throw err;
        console.log('All done!');
        callback();
      }
    );
  }
], (err, results) => {
  if (err) throw err;
});
