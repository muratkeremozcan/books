// unlike other primitive types, symbol does not have a literal form

// simple primitives  : string  number  boolean  object  null   undefined ( SYMBOL got added  in ES6! )
// complex primitives  : String  Number  Boolean  Object  Array  Date  RegExp  Error (all of type object)
// side note, falsies : ''      0       false            null   undefined

{
  // create a symbol
  // * do not use a new (not a constructor, nor you are producing an object)
  // * optional description parameter, only used for stringification
  var sym = Symbol('optional description');
  typeof sym; //?
  sym.toString(); //?

  // the internal value of a symbol (referred to as its name) is hidden from the code and cannot be obtained
  // the main point of a symbol is to create a string-like value that can’t collide with any other value. 
  // So, for example, consider using a symbol as a constant representing an event name:
  const EVT_LOGIN = Symbol('event.login');
  // The benefit here is that EVT_LOGIN holds a value that cannot be duplicated (accidentally or otherwise) by any other value, 
  // so it is impossible for there to be any confusion of which event is being dispatched or handled.
}

////
{
  // singleton pattern behavior - only allowed to be created once

  const INSTANCE = Symbol('instance');
  // The INSTANCE symbol value here is a special, almost hidden, meta-like property stored statically on the HappyFace() function object.
  // It could alternatively have been a plain old property like __instance, and the behavior would have been identical. 
  // The usage of a symbol simply improves the metaprogramming style, keeping this INSTANCE property set apart from any other normal properties.
  function HappyFace() {
    if (HappyFace[INSTANCE]) return HappyFace[INSTANCE];

    function smile() {/* */ };
    return HappyFace[INSTANCE] = {
      smile: smile
    };
  }
  var me = HappyFace(),
    you = HappyFace()

  me === you; //?
}


{
  // Symbol.for can be used to aid with global access to these symbols, you can create symbol values with the global symbol registry.
  // Symbol.for(..) looks in the global symbol registry to see if a symbol is already stored with the provided description text, and returns it if so. 
  // If not, it creates one to return. In other words, the global symbol registry treats symbol values, by description text, as singletons themselves.
  // any part of your application can retrieve the symbol from the registry using Symbol.for(..), as long as the matching description name is used.

  const EVT_LOGIN = Symbol.for('event.login');
  const INSTANCE = Symbol.for('instance');
  
  const s = Symbol.for( "something cool" ); 

  // You can retrieve a registered symbol’s description text (key) using Symbol.keyFor(..):
  var desc = Symbol.keyFor(s);  //?
  
  const s2 = Symbol.for( desc ); //?

  s2 === s; //?
}