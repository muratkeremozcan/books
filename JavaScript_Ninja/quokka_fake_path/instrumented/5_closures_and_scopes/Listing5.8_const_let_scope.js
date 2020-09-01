$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
const GLOBAL_NINJA = ($_$w(1, 1), 'Yoshi');
const objectConst = ($_$w(1, 2), { weapon: 'MODIFY ME' });
const anArrayConst = ($_$w(1, 3), [1]);
function reportActivity() {
    $_$wf(1);
    const functionActivity = ($_$w(1, 4), 'jumping');
    for (let i = 1; $_$w(1, 5), i < 3; i++) {
        let forMessage = ($_$w(1, 6), GLOBAL_NINJA + ' ' + functionActivity);
        $_$w(1, 7), assert(forMessage === 'Yoshi jumping', 'error: Yoshi isn\'t jumping within the for block.');
        $_$w(1, 8), assert(i, 'error: current loop counter doesn\'t exist');
        $_$w(1, 9), $_$tracer.log(i, 'i', 1, 9);
    }
    $_$w(1, 10), assert(typeof i === 'undefined', 'error: loop variable declared with let are accessible outside of the loop');
    $_$w(1, 11), assert(typeof forMessage === 'undefined', 'error: loop variable declared with let are accessible outside of the loop');
    $_$w(1, 12), $_$tracer.log('the inner variable i \'s type is :', typeof i, '', 1, 12);
    $_$w(1, 13), $_$tracer.log('the inner variable forMessage \'s type is :', typeof forMessage, '', 1, 13);
}
$_$w(1, 14), reportActivity();
$_$w(1, 15), assert(($_$w(1, 16), ($_$w(1, 18), typeof functionActivity === 'undefined') && ($_$w(1, 19), typeof i === 'undefined')) && ($_$w(1, 17), typeof forMessage === 'undefined'), 'error: variable functionActivity is not undefined');
$_$w(1, 20), $_$tracer.log('\nthe inner variable functionActivity \'s type is :', typeof functionActivity, '', 1, 20);
$_$w(1, 21), $_$tracer.log('the inner variable i \'s type is :', typeof i, '', 1, 21);
$_$w(1, 22), $_$tracer.log('the inner variable forMessage \'s type is :', typeof forMessage, '', 1, 22);
$_$w(1, 23), objectConst.weapon = 'washizaki';
$_$w(1, 24), anArrayConst.crazyModifyProperty = 'nunchuck';
$_$w(1, 25), $_$tracer.log('\n We can modify the properties of constants : ', objectConst.weapon + ' and ' + anArrayConst.crazyModifyProperty, '', 1, 25);
$_$w(1, 26), objectConst.skill = 'slashAndDash';
$_$w(1, 27), anArrayConst.madeUpProperty = 'madeUP!';
$_$w(1, 28), $_$tracer.log(objectConst.slashAndDash, 'objectConst.slashAndDash', 1, 28);
$_$w(1, 29), $_$tracer.log(anArrayConst.madeUpProperty, 'anArrayConst.madeUpProperty', 1, 29);
$_$w(1, 30), anArrayConst.push('extending the array');
$_$w(1, 31), $_$tracer.log(anArrayConst, 'anArrayConst', 1, 31);
$_$wpe(1);