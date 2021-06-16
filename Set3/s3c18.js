// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C18: Implement AES CTR Mode
//
//
/////////////////////////////////////////////////////
const { getAes128CTRCipher } = require('../utility/streamUtils')

var key = Buffer.from('YELLOW SUBMARINE');
var iv = null;
var nonce = Buffer.alloc(8,0x00);
var cipher = getAes128CTRCipher( key, iv, nonce );

var result = cipher.update( Buffer.from("L77na/nrFsKvynd6HzOoG7GHTLXsTVu9qvY/2syLXzhPweyyMTJULu/6/kXX0KSvoOLSFQ==","base64") );
console.log( result.toString('utf-8'));



