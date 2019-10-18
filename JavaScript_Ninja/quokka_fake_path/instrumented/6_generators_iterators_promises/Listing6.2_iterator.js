$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
function* WeaponGenerator() {
    $_$wf(1);
    $_$w(1, 1), yield 'Katana';
    $_$w(1, 2), yield 'Wakizashi';
    $_$w(1, 3), yield 'Kusarigama';
}
const weaponsIterator = ($_$w(1, 4), WeaponGenerator());
const result1 = ($_$w(1, 5), weaponsIterator.next());
const result2 = ($_$w(1, 6), weaponsIterator.next());
const result3 = ($_$w(1, 7), weaponsIterator.next());
const result4 = ($_$w(1, 8), weaponsIterator.next());
$_$w(1, 9), $_$tracer.log('iterated object types are : ', result1 + ' ' + result2 + ' ' + result3, '', 1, 9);
$_$w(1, 10), $_$tracer.log('iterated values are : ', result1.value + ' ' + result2.value + ' ' + result3.value, '', 1, 10);
$_$w(1, 11), $_$tracer.log('is the 1st iterated object done? ', result1.done, '', 1, 11);
$_$w(1, 12), $_$tracer.log('is the 2nd iterated object done? ', result2.done, '', 1, 12);
$_$w(1, 13), $_$tracer.log('is the 3rd iterated object done? ', result3.done, '', 1, 13);
$_$w(1, 14), $_$tracer.log('is the last object done? ', result4.done, '', 1, 14);
$_$w(1, 15), assert(($_$w(1, 16), ($_$w(1, 18), typeof result1 === 'object') && ($_$w(1, 19), typeof result2 === 'object')) && ($_$w(1, 17), typeof result3 === 'object'), 'error: the type of the iterated objects is not object');
$_$w(1, 20), assert(($_$w(1, 21), ($_$w(1, 23), result1.value === 'Katana') && ($_$w(1, 24), result2.value === 'Wakizashi')) && ($_$w(1, 22), result3.value === 'Kusarigama'), 'error: the value of the iterated objects are not correct');
$_$w(1, 25), assert(($_$w(1, 26), !result1.done) && ($_$w(1, 27), !result2.done));
$_$wpe(1);