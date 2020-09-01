$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
function* WeaponGenerator() {
    $_$wf(1);
    $_$w(1, 1), yield 'Katana';
    $_$w(1, 2), yield 'Wakizashi';
    $_$w(1, 3), yield 'Kusarigama';
}
for (let weapon of ($_$w(1, 4), WeaponGenerator())) {
    $_$w(1, 5), $_$tracer.log(weapon, 'weapon', 1, 5);
    $_$w(1, 6), assert(weapon !== undefined, 'error: values are undefined');
}
$_$wpe(1);