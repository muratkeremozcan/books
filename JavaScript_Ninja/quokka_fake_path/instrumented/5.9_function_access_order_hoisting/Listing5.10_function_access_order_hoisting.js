$_$wp(1);
$_$w(1, 0), $_$tracer.log('1st ) function declarations; type of fun is: ', typeof fun, '', 1, 0);
var fun = ($_$w(1, 1), 3);
$_$w(1, 2), $_$tracer.log('2nd) vars, func expressions, arrow functions 2nd; type of fun is: ', typeof fun, '', 1, 2);
function fun() {
    $_$wf(1);
}
$_$w(1, 3), $_$tracer.log('3rd) any other code. During actual program execution, function declarations are skipped; type of fun is :', typeof fun, '', 1, 3);
$_$wpe(1);