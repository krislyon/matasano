// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C1: Output hexData as base64
/////////////////////////////////////////////////////
const hexData = "49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d"
const b64data = Buffer.from( hexData, 'hex').toString('base64');
console.log( b64data );

