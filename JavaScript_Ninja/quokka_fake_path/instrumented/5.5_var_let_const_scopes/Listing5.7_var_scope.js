$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
var globalNinja = ($_$w(1, 1), 'Yoshi');
function reportActivity() {
    $_$wf(1);
    var functionActivity = ($_$w(1, 2), 'jumping');
    for (var i = 1; $_$w(1, 3), i < 3; i++) {
        var forMessage = ($_$w(1, 4), globalNinja + ' ' + functionActivity);
        $_$w(1, 5), assert(forMessage === 'Yoshi jumping', 'error: Yoshi isn\'t jumping within the for block.');
        $_$w(1, 6), assert(i, 'error: current loop counter doesn\'t exist');
        $_$w(1, 7), $_$tracer.log(i, 'i', 1, 7);
    }
    $_$w(1, 8), assert(($_$w(1, 9), i === 3) && ($_$w(1, 10), forMessage === 'Yoshi jumping'), 'error: loop variables are not accessible outside of the loop');
    $_$w(1, 11), $_$tracer.log('loop variable i is accessible outside the loop, it\'s value is :', i, '', 1, 11);
    $_$w(1, 12), $_$tracer.log('loop variable forMessage is accessible outside the loop, it\'s value is :', forMessage, '', 1, 12);
}
$_$w(1, 13), reportActivity();
$_$w(1, 14), assert(($_$w(1, 15), ($_$w(1, 17), typeof functionActivity === 'undefined') && ($_$w(1, 18), typeof i === 'undefined')) && ($_$w(1, 16), typeof forMessage === 'undefined'), 'error: variable functionActivity is not undefined');
$_$w(1, 19), $_$tracer.log('\n the inner variable functionActivity \'s type is :', typeof functionActivity, '', 1, 19);
$_$w(1, 20), $_$tracer.log('\n the inner variable i \'s type is :', typeof i, '', 1, 20);
$_$w(1, 21), $_$tracer.log('\n the inner variable forMessage \'s type is :', typeof forMessage, '', 1, 21);
$_$wpe(1);