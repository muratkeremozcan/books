$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
function* WarriorGenerator() {
    $_$wf(1);
    $_$w(1, 1), yield 'Sun Tzu';
    $_$w(1, 2), yield* NinjaGenerator();
    $_$w(1, 3), yield 'Genghis Khan';
}
function* NinjaGenerator() {
    $_$wf(1);
    $_$w(1, 4), yield 'Hattori';
    $_$w(1, 5), yield 'Yoshi';
}
for (let warrior of ($_$w(1, 6), WarriorGenerator())) {
    $_$w(1, 7), $_$tracer.log(warrior, 'warrior', 1, 7);
}
$_$wpe(1);