////////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C5: Implement Repeating Key XOR
/////////////////////////////////////////////////////
const { repeatingXorEncrypt } = require('../utility/xorUtils');

const testVector = "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal"
const result = repeatingXorEncrypt( Buffer.from(testVector), Buffer.from("ICE") );

console.log( result.toString('hex') );