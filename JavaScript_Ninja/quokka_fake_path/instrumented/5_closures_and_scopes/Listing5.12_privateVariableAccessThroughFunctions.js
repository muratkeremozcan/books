$_$wp(1);
var assert = ($_$w(1, 0), require('assert'));
function Ninja() {
    $_$wf(1);
    var feints = ($_$w(1, 1), 0);
    $_$w(1, 2), this.getFeints = function () {
        $_$wf(1);
        return $_$w(1, 3), feints;
    };
    $_$w(1, 4), this.feint = function () {
        $_$wf(1);
        $_$w(1, 5), feints++;
    };
}
var ninja1 = ($_$w(1, 6), new Ninja());
$_$w(1, 7), ninja1.feint();
var imposter = ($_$w(1, 8), {});
$_$w(1, 9), imposter.getFeints = ninja1.getFeints;
$_$w(1, 10), assert(ninja1.feints === undefined, 'error: could access private variable');
$_$w(1, 11), assert(ninja1.getFeints() === 1, 'error: could not access private variable via accessor method');
$_$w(1, 12), $_$tracer.log(ninja1.getFeints(), 'ninja1.getFeints()', 1, 12);
$_$w(1, 13), $_$tracer.log(ninja1, 'ninja1', 1, 13);
$_$w(1, 14), assert(imposter.getFeints() === 1, 'error: imposter cannot access ninja1\'s getFeints function');
$_$w(1, 15), $_$tracer.log(imposter.getFeints(), 'imposter.getFeints()', 1, 15);
$_$w(1, 16), $_$tracer.log(imposter, 'imposter', 1, 16);
var ninja2 = ($_$w(1, 17), new Ninja());
$_$w(1, 18), assert(ninja2.getFeints() === 0, 'error: could not access private variable via accessor method');
$_$w(1, 19), $_$tracer.log(ninja2.getFeints(), 'ninja2.getFeints()', 1, 19);
$_$w(1, 20), $_$tracer.log(ninja2, 'ninja2', 1, 20);
$_$wpe(1);