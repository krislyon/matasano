// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C17: CBC Padding Oracle
/////////////////////////////////////////////////////
const crypto = require('crypto')
const { aes128CbcEncrypt, aes128CbcDecrypt } = require('../utility/blockUtils');
const { applyPkcs7Padding, removePkcs7Padding } = require('../utility/pkcs7');

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
    return aes128CbcEncrypt( applyPkcs7Padding( Buffer.from(msg,"base64"), 16, false ) , aesKey, iv, false );
}

function paddingOracle( ciphertext, iv ){
    var plaintext =  aes128CbcDecrypt( ciphertext, aesKey, iv, false );
    try{
       plaintext = removePkcs7Padding( plaintext )
    }catch( err ){
        return false
    }
    return true;
}

function bruteforcePadding( corruptionIndex, targetIndex, corruptedBuffer, solvedBuffer, internalStateBuffer, origByte, validPad, iv, corruptBlock ){
    var i=0;
    var found = false;
    var solution = false;
    while( i<=255 && !found){
        if( corruptBlock >= 0 ){
            corruptedBuffer[corruptionIndex] = i;
        }else{
            iv[corruptionIndex] = i;
        }

        var oracleResult = paddingOracle( corruptedBuffer, iv );

        if( oracleResult == true ){

            if( solution != true ){
                solvedBuffer[targetIndex%blocksize] = i ^ origByte ^ validPad;
                internalStateBuffer[targetIndex%blocksize] = solvedBuffer[targetIndex%blocksize] ^ origByte;
                //console.log(`cb[${corruptionIndex}]: 0x${corruptedBuffer[corruptionIndex].toString(16)}, i: 0x${i.toString(16)}, CxI: 0x${(corruptedBuffer[corruptionIndex]^i).toString(16)}, iStateByte: 0x${internalStateBuffer[targetIndex%blocksize].toString(16)}, plainTextByte: 0x${solvedBuffer[targetIndex%blocksize].toString(16)}`)
                //found = true;
                solution = true;
            }else {
                console.log(`******* Alternate solution detected:  ${i}`)
            }
        }
        i++;

    }

    if( solution == false ){
        console.log(`**** NO SOLUTION: cb[${corruptionIndex}]: 0x${corruptedBuffer[corruptionIndex].toString(16)}, i: 0x${i.toString(16)}, validPad: ${validPad.toString(16)}`)
        console.log(`Corrup: ${corruptedBuffer.toString('hex')}`)
        console.log(`IState: ${internalStateBuffer.toString('hex')}`)
        console.log(`Solved: ${solvedBuffer.toString('hex')}`)
    }
    //console.log('----------')
}

function decryptBlock( targetBlock, ciphertext, iv, blocksize ){
    var corruptBlock = targetBlock - 1;
    var istate = Buffer.alloc( blocksize );
    var solved = Buffer.alloc( blocksize );

    // Trim solved block from corrupted array.
    var corrupted = Buffer.from(  ciphertext.subarray(0, (targetBlock*blocksize) + blocksize ));

    // Fully corrupt the block so there is less chance of accidental valid padding
    if( corruptBlock >= 0 ){
        crypto.randomBytes(blocksize).copy( corrupted, corruptBlock * blocksize );
    }else{
        // If we're on the last block, corrupt the iv.  ( not really realistic, but lets do it anyway.)
        crypto.randomBytes(blocksize).copy( iv, blocksize );
    }

    // Iterate through bytes in the block
    for( var j=(blocksize-1); j>=0; j-- ){
        var targetIndex = (targetBlock * blocksize) + j;
        var validPad = blocksize - j;

        var corruptionIndex = 0;
        var origByte = 0;
        if( corruptBlock >= 0 ){
            corruptionIndex = (corruptBlock * blocksize) + j;
            origByte = ciphertext[corruptionIndex];
        }else{
            corruptionIndex = j;
            origByte = iv[corruptionIndex];
        }

        // Adjust the known bits of the block to match valid padding.
        for( var k=1; k<validPad; k++ ){
            if( corruptBlock >= 0 ){
                corrupted[corruptionIndex+k] = istate[(corruptionIndex%blocksize)+k] ^ validPad;
            }else{
                iv[corruptionIndex+k] = istate[corruptionIndex+k] ^ validPad;
            }
        }

        // Brute force the target byte
        bruteforcePadding( corruptionIndex, targetIndex, corrupted, solved, istate, origByte, validPad, iv, corruptBlock );
    }

    console.log(`Decrytped Block ${targetBlock} as: [${solved.toString('hex')}], - '${solved.toString('utf-8')}'`)
    return solved;
}


var aesKey = crypto.randomBytes(16);
var iv = crypto.randomBytes(16);
var blocksize = 16;
var ciphertext = getMessage();
var plaintext = Buffer.from('');

console.log(`Ciphertext length: ${ciphertext.length} Bytes`);

for( var block=(ciphertext.length/blocksize)-1; block>=0; block-- ){
    // Decrypt Block
    plaintext = Buffer.concat( [decryptBlock( block, ciphertext, iv, blocksize ),plaintext] );
}

try{
    plaintext = removePkcs7Padding( plaintext );
}catch( err ){
    console.log( err );
}
console.log( plaintext.toString('utf-8'))

