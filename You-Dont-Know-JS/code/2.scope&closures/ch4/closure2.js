// Whatever facility we use to transport an inner function outside of its lexical scope, 
    // it will maintain a scope reference to where it was originally declared, and wherever we execute him, 
    // that closure will be exercised.


var fn;

function foo() {
    var a = 2;

    function baz() {
        console.log(a);
    }

    fn = baz; // assign baz to global variable
}

function bar() {
    fn(); // look ma, I saw closure!
}

foo(); 

bar(); // 2

