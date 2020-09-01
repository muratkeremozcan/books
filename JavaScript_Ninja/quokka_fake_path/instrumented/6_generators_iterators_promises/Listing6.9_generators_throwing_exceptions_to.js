$_$wp(1);
function* NinjaGenerator() {
    $_$wf(1);
    try {
        $_$w(1, 0), yield 'Hattori';
        $_$w(1, 1), fail('the exception did not occur. This fail should not be reached at all!');
    } catch (e) {
        $_$w(1, 2), $_$tracer.log(e, 'e', 1, 2);
    }
}
const ninjaIterator = ($_$w(1, 3), NinjaGenerator());
const result1 = ($_$w(1, 4), ninjaIterator.next());
$_$w(1, 5), $_$tracer.log('we got ', result1.value, '', 1, 5);
$_$w(1, 6), ninjaIterator.throw('Aha! We caught an exception!');
$_$wpe(1);