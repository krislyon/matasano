// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C3: Output hexData as base64
/////////////////////////////////////////////////////
const { crackSingleByteXor, repeatingBufferXor } = require('../utility/xorUtils');

const encData = Buffer.from( "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736",'hex');
var result = crackSingleByteXor( encData );

console.log('Suspected Key: 0x' + Buffer.from( String.fromCharCode(result[0].key) ).toString('hex') );
var output = repeatingBufferXor( encData, Buffer.from( String.fromCharCode(result[0].key) ));
console.log( "Result: '" + output.toString('ascii') + "'");



