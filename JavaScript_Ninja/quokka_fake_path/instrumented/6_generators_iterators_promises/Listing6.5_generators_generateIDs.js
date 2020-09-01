$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
function* IdGenerator() {
    $_$wf(1);
    let id = ($_$w(1, 1), 0);
    while ($_$w(1, 2), true) {
        $_$w(1, 3), yield ++id;
    }
}
const idIterator = ($_$w(1, 4), IdGenerator());
const ninja1 = ($_$w(1, 5), { id: idIterator.next().value });
$_$w(1, 6), $_$tracer.log('ninja id property\'s value:' + ninja1.id, '\'ninja id property\\\'s value:\' + ninja1.i...', 1, 6);
const ninja2 = ($_$w(1, 7), { id: idIterator.next().value });
const ninja3 = ($_$w(1, 8), { id: idIterator.next().value });
$_$w(1, 9), $_$tracer.log('ninja id property\'s value:' + ninja2.id, '\'ninja id property\\\'s value:\' + ninja2.i...', 1, 9);
$_$w(1, 10), $_$tracer.log('ninja id property\'s value:' + ninja3.id, '\'ninja id property\\\'s value:\' + ninja3.i...', 1, 10);
$_$wpe(1);