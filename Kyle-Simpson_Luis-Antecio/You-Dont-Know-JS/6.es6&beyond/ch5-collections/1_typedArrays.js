// TypedArrays provide “view” s of binary data buffers that align with various integer types, like 8-bit or 16-bit unsigned integers and 32-bit floats. 
// The array access to binary data makes operations much easier to express and maintain, which enables you to more easily work with complex data like video, audio, canvas data, and so on.


// to construct a bit-bucket / binary buffer that is 32-bytes long (256 bits):
var buf = new ArrayBuffer(32);
buf.byteLength; //?

// on top of this array buffer, you can then layer a “view,” which comes in the form of a typed array.
// arr is a typed array of 16 unsigned integers mapped over the 256 bit buf buffer, meaning you get 16 elements
var arr = new Uint16Array(buf);
arr.length; //?
arr;

//////
// Endianness
// Endian means if the low-order byte (collection of 8-bits) of a multi-byte number 
// — such as the 16-bit unsigned ints we created in the earlier snippet - is on the right or the left of the number’s bytes
// ex: if you  received the bits of 3085 as 0000110100001100 from a little-endian system, but you layered a view on top of it in a big-endian system, 
// you’d instead see value 3340 (base-10) and 0d0c (base-16).


// testing endianness
var littleEndian = (function() { 
  var buffer = new ArrayBuffer( 2 ); 
  // DataView provides more low-level, fine-grained control over accessing (setting/ getting) the bits from the view you layer over the buffer.
  // the 3rd parameter of setInt16  tells DataView what endianness you’re wanting it to use for that operation.
  new DataView( buffer ).setInt16( 0, 256, true );  
  return new Int16Array( buffer )[0] === 256; 
})(); //?

// Do not confuse endianness of underlying binary storage in array buffers with how a given number is represented when exposed in a JS program. 
// For example, (3085). toString(2) returns "110000001101", which with an assumed leading four "0" s appears to be the big-endian representation.


//////
// Multiple views: a single buffer can have multiple views attached to it,

var buf = new ArrayBuffer(2);

var view8 = new Uint8Array(buf);
var view16 = new Uint16Array(buf);
// Note: Uint8Array and Uint16Array take two extra parameters: byteOffset and length. 
// In other words, you can start the typed array view at a location other than 0 and you can make it span less than the full length of the buffer.


view16[0] = 3085;
view16; //?
view8; //?
view8[0]; //?
view8[1]; //?

view8[0].toString(16); //?
view8[1].toString(16); //?

// swap
var tmp = view8[0];
view8[0] = view8[1];
view8[1] = tmp;
view16[0]; //?

// the book goes into detail about Typed Array constructors on page 163