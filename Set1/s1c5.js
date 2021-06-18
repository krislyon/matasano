////////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C5: Implement Repeating Key XOR
/////////////////////////////////////////////////////
const { repeatingBufferXor } = require('../utility/xorUtils');

const testVector = "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal"
const result = repeatingBufferXor( Buffer.from(testVector), Buffer.from("ICE") );

console.log( result.toString('hex') );