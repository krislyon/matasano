// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C2: XOR the two strings together, output the result.
/////////////////////////////////////////////////////
const { bufferXor } = require('../utility/xorUtils')

const buf1 = Buffer.from( "1c0111001f010100061a024b53535009181c", 'hex');
const buf2 = Buffer.from( "686974207468652062756c6c277320657965", 'hex');

const resultArray = bufferXor(buf1,buf2);

console.log( resultArray.toString('hex') );

