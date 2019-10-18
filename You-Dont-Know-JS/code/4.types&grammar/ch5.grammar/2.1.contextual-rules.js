function bar() { return console.log('hello'); }
// The a reference is called an “l-value” (aka left-hand value) since it’s the target of an assignment. 
// The { .. } pair is an “r-value” (aka right-hand value) since it’s used just as a value (in this case as the source of an assignment).

var a = {
  foo: bar()
};

// what happens if you remove the assignments? Still runs because { } is a code block
  // this works because of 'labelled statements"
{
  foo: bar()
}
// JS supports a special form of goto: labeled jumps with 'continue' (next section)

