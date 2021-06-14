////////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C7: Implement AES-128-ECB
/////////////////////////////////////////////////////
const fs = require('fs');
const { aes128EcbDecrypt } = require('../../utility/blockUtils')

// Load the dataset
var fileData = fs.readFileSync('./matasano/Set1/data/7.txt', 'ascii');
fileData = fileData.replace(/\r?\n|\r/g,"").trim();
const encrypted = Buffer.from( fileData, 'base64');
console.log("Loaded Dataset");

var key = Buffer.from("YELLOW SUBMARINE",'ascii');
console.log('Key Length: ' + key.length );
console.log('Key: \'' + key + '\'' );
console.log('Data Length: ' + encrypted.length );
console.log( encrypted );

console.log( aes128EcbDecrypt( encrypted, key, null, false ).toString('utf-8') );
