$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
function* NinjaGenerator(action) {
    $_$wf(1);
    const imposter = ($_$w(1, 1), yield 'Hattori ' + action);
    $_$w(1, 2), $_$tracer.log(imposter, 'imposter', 1, 2);
    $_$w(1, 3), yield 'Yoshi (' + imposter + ') ' + action;
}
const ninjaIterator = ($_$w(1, 4), NinjaGenerator('skulk'));
const result1 = ($_$w(1, 5), ninjaIterator.next());
$_$w(1, 6), $_$tracer.log(result1, 'result1', 1, 6);
$_$w(1, 7), $_$tracer.log(result1.value, 'result1.value', 1, 7);
$_$w(1, 8), $_$tracer.log(result1.done, 'result1.done', 1, 8);
$_$w(1, 9), assert(result1.value === 'Hattori skulk', 'error: result1 is not correct');
const result2 = ($_$w(1, 10), ninjaIterator.next('Hanzo'));
$_$w(1, 11), $_$tracer.log(result2, 'result2', 1, 11);
$_$w(1, 12), $_$tracer.log(result2.value, 'result2.value', 1, 12);
$_$w(1, 13), $_$tracer.log(result2.done, 'result2.done', 1, 13);
$_$wpe(1);