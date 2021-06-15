// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C17: CBC Padding Oracle
/////////////////////////////////////////////////////
const crypto = require('crypto')
const { aes128CbcEncrypt, aes128CbcDecrypt } = require('../utility/blockUtils');
const { applyPkcs7Padding, removePkcs7Padding } = require('../utility/pkcs7');

var aesKey = crypto.randomBytes(16);
var iv = crypto.randomBytes(16);

function getRandomInt(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor( Math.random() * (max-min+1)) + min;
}

function getMessage(){
    var msgData = [
        "MDAwMDAwTm93IHRoYXQgdGhlIHBhcnR5IGlzIGp1bXBpbmc=",
        "MDAwMDAxV2l0aCB0aGUgYmFzcyBraWNrZWQgaW4gYW5kIHRoZSBWZWdhJ3MgYXJlIHB1bXBpbic=",
        "MDAwMDAyUXVpY2sgdG8gdGhlIHBvaW50LCB0byB0aGUgcG9pbnQsIG5vIGZha2luZw==",
        "MDAwMDAzQ29va2luZyBNQydzIGxpa2UgYSBwb3VuZCBvZiBiYWNvbg==",
        "MDAwMDA0QnVybmluZyAnZW0sIGlmIHlvdSBhaW4ndCBxdWljayBhbmQgbmltYmxl",
        "MDAwMDA1SSBnbyBjcmF6eSB3aGVuIEkgaGVhciBhIGN5bWJhbA==",
        "MDAwMDA2QW5kIGEgaGlnaCBoYXQgd2l0aCBhIHNvdXBlZCB1cCB0ZW1wbw==",
        "MDAwMDA3SSdtIG9uIGEgcm9sbCwgaXQncyB0aW1lIHRvIGdvIHNvbG8=",
        "MDAwMDA4b2xsaW4nIGluIG15IGZpdmUgcG9pbnQgb2g=",
        "MDAwMDA5aXRoIG15IHJhZy10b3AgZG93biBzbyBteSBoYWlyIGNhbiBibG93"
    ];
    var msg = msgData[getRandomInt(0,msgData.length-1)];
    return aes128CbcEncrypt( applyPkcs7Padding( Buffer.from(msg,"base64"), 16, true) , aesKey, iv, false );
}

function paddingOracle( ciphertext ){
    var plaintext =  aes128CbcDecrypt( ciphertext, aesKey, iv, false );
    try{
       plaintext = removePkcs7Padding( plaintext )
    }catch( err ){
        return false
    }
    return true;
}


var blocksize = 16;
var ciphertext = getMessage();



var targetIndex = ciphertext.length - blocksize - 1;
var origByte = ciphertext[targetIndex];
var corrupted = Buffer.from( ciphertext );
crypto.randomBytes(16).copy( corrupted, corrupted.length-32 );



var validPad = 0x01;
for( var i=0; i<255; i++ ){
    corrupted[targetIndex] = i;
    var oracleResult = paddingOracle( corrupted );
    if( oracleResult == true ){
        var plaintextByte = i ^ origByte ^ validPad;
        var intermediateByte = plaintextByte ^ origByte;
        console.log(`i: ${i}, iStateByte: ${intermediateByte}, plainTextByte: ${plaintextByte}`)
    }
}






