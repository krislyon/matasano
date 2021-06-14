// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C10: Manually Implement CBC
/////////////////////////////////////////////////////
const fs = require('fs');
const { aes128DecryptManualCBC } = require('../utility/blockUtils');

// Load the dataset
var fileData = fs.readFileSync('./Set2/data/10.txt', 'ascii');
fileData = fileData.replace(/\r?\n|\r/g,"").trim();
const plaintext = Buffer.from( fileData, 'base64');
console.log("Loaded Dataset");

var key = Buffer.from("YELLOW SUBMARINE",'ascii');
var iv  = Buffer.from("00000000000000000000000000000000", 'hex');
console.log(`Key: '${key}', (${key.length} bytes)`);
console.log(`IV: '${iv.toString('hex')}', (${iv.length} bytes)`);

const result = aes128DecryptManualCBC( plaintext, key, iv, false);

console.log(result.toString('utf-8'));



