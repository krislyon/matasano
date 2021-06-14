// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C11: ECB/CBC Detection Oracle
/////////////////////////////////////////////////////
const crypto = require('crypto');
const { aes128EcbEncrypt, aes128EncryptManualCBC, getBlockArray } = require('../../utility/blockUtils');

function generateRandomAESKey(){
    return crypto.randomBytes(16);
}

function getRandomInt(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor( Math.random() * (max-min+1)) + min;
}

function encryptData(plaintext){
    var plaintext = Buffer.concat( [crypto.randomBytes( getRandomInt(5,10) ), plaintext, crypto.randomBytes( getRandomInt(5,10)) ]);
    var key = generateRandomAESKey();

    if( getRandomInt(0,1) == 1 ){
        // Encrypt with CBC
        console.log("Encrypting with CBC");
        return aes128EncryptManualCBC( plaintext, key, crypto.randomBytes(16), false );
    }else{
        // Encrypt with ECB
        console.log("Encrypting with ECB");
        return aes128EcbEncrypt( plaintext, key, null, true );
    }
}

function detectBlockMode(ciphertext){
    var matchCount = 0;
    const blocks = getBlockArray( ciphertext, 16 );
    for( var i=0; i<blocks.length; i++ ){
        for( var j=i+1; j<blocks.length; j++ ){
            if( blocks[i].compare(blocks[j]) == 0 ){
                matchCount++;
            }
        }
    }

    if( matchCount > 0 ){
        console.log("ECB mode detected.")
    }else{
        console.log("CBC mode detected.")
    }
}

const plaintext = Buffer.from("abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd", 'hex');
detectBlockMode( encryptData( plaintext ) );
