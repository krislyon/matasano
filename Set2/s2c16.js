// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C16: CBC Bitflipping Attacks
/////////////////////////////////////////////////////
const crypto = require('crypto');
const { applyPkcs7Padding, removePkcs7Padding } = require('../utility/pkcs7')
const { aes128EncryptManualCBC, aes128DecryptManualCBC } = require('../utility/blockutils');
const { profile } = require('console');

const aesKey = crypto.randomBytes(16);
const iv = crypto.randomBytes(16);

function blockSpace( buffer, encoding, blocksize, separator = " " ){
    var blockString = "";
    for( var i=0; i<(buffer.length/blocksize); i++ ){
        var block = buffer.subarray(i*blocksize,(i*blocksize)+blocksize);
        blockString += block.toString( encoding ) + separator;
    }
    return blockString;
}

function parseProfile( kvString ){
    return kvString.split(';')
        .map( (pair) => {
            kv = pair.split('=');
            return {  [kv[0]] : kv[1] }
        }).
        reduce( (previous,current) => {
            return { ...current, ...previous };
        });
}

function encrypt( userdataString ){
    if( userdataString.includes(';') || userdataString.includes('=') ){
        throw 'Invalid characters in input string';
    }

    var prefix = "comment1=cooking%20MCs;userdata=";
    var postfix = ";comment2=%20like%20a%20pound%20of%20bacon";
    var paddedBuffer = applyPkcs7Padding( Buffer.from( prefix + userdataString + postfix ), 16 );

    console.log( `Encrypt Buffer: '${paddedBuffer.toString('utf-8')}', Bytes: ${paddedBuffer.length}`);
    //console.log( blockSpace( paddedBuffer, 'hex', 16 ));

    return aes128EncryptManualCBC( paddedBuffer, aesKey, iv, false );
}

function decrypt( ciphertext ){
    var plainText = aes128DecryptManualCBC( ciphertext, aesKey, iv, false );
    console.log( `Decrypt Buffer: '${plainText.toString('utf-8')}', Bytes: ${plainText.length}`);
    //console.log( blockSpace( plainText, 'hex', 16 ));

    var output = removePkcs7Padding( plainText )
    var profileObj = parseProfile( output.toString('utf-8'));

    console.log('Decryption Result');
    console.log('----------------------------');

    for( prop in profileObj ){
        console.log(`${prop} : ${profileObj[prop]}`)
    }

    if( ('admin' in profileObj) && profileObj['admin'] == 'true' ){
        console.log('ADMIN Privledges Granted');
    }
}

// Target String
// comment1=cooking    %20MCs;userdata=    XXXXXXXXXXXXXXXX    XXXXX;admin=true    ;comment2=%20lik    e%20a%20pound%20    of%20bacon
var attackInput = "XXXXXXXXXXXXXXXXXXXXX\x3aadmin\x3ctrue";
var ciphertext = encrypt(attackInput);

// In order to properly corrupt the block we need to know what the output of the cipher core is before
// chaining.  Fortunately we know ciphertext and what the target letter is because we control it, so
// we can use xor to determine the output of the cipher core, and then determine the appropriate
// corruption with simple logical operations.

// Corrupt byte 37 to push create error in next block.
ciphertext[37] = ciphertext[37] ^ 0x3a;
ciphertext[37] = ciphertext[37] ^ 0x3b;

// Corrupt byte 43 to push create error in next block.
ciphertext[43] = ciphertext[43] ^ 0x3c;
ciphertext[43] = ciphertext[43] ^ 0x3d;

decrypt(ciphertext);
