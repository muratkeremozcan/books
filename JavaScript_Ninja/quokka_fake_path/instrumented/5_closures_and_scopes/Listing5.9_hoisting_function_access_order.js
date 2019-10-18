$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
$_$w(1, 1), assert(typeof fun === 'function', 'error: typeof fun is wrong');
$_$w(1, 2), assert(typeof myFunExpr === 'undefined', 'error: typeof myFunExpr is wrong');
$_$w(1, 3), assert(typeof myArrowExpr === 'undefined', 'error: typeof myArrowExpr is wrong');
function fun() {
    $_$wf(1);
}
var $_$wvd5 = $_$w(1, 4), myFunExpr = function () {
        $_$wf(1);
    };
var $_$wvd6 = $_$w(1, 5), myArrowExpr = x => {
        $_$wf(1);
        return $_$w(1, 6), x;
    };
$_$wpe(1);