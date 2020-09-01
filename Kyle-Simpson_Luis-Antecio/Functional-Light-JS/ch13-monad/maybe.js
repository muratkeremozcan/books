// the Maybe monad is a particular pairing of two other simpler monads: Just and Nothing.
// Nothing is a monad that holds an empty value. Maybe is a monad that either holds a Just or a Nothing.
import { prop, Maybe, curry} from '../fp-tool-belt';

var someObj = {
  something: {
    else: {
      entirely: 'Murat'
    }
  }
};


function isEmpty(val) {
  return val === null || val === undefined;
}

var safeProp = curry( function safeProp(prop,obj){
  if (isEmpty( obj[prop] )) return Maybe.Nothing();
  return Maybe.of( obj[prop] );
} );


// the importance of this kind of monad representation is that 
// whether we have a Just(..) instance or a Nothing() instance, we’ll use the API methods the same
// The power of the Maybe abstraction is to encapsulate that behavior/ no-op duality implicitly.
// if at any point in the chain we get a null/ undefined value, the Maybe magically switches into no-op mode 
/// – it’s now a Nothing() monad instance! – and stops doing anything for the rest of the chain. 
// That makes the nested-property access safe against throwing JS exceptions if some property is missing/ empty.

Maybe.of( someObj )
.chain( safeProp( "something" ) )
.chain( safeProp( "else" ) )
.chain( safeProp( "entirely" ) )
.map( console.log );