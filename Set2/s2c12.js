// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C12: Byte at a time ECB Decryption
/////////////////////////////////////////////////////
const crypto = require('crypto');
const { aes128EcbEncrypt, detectBlockSize, detectECBMode } = require('../utility/blockUtils');

var key = crypto.randomBytes(16);

function encryptData(plaintext,key){
    var data = Buffer.from("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK",'base64');
    var plaintext = Buffer.concat( [plaintext,data] );
    // Encrypt with ECB
    //console.log("Encrypting with ECB");
    return aes128EcbEncrypt( plaintext, key, null, true );
}

function constructCodebook( knownBuf, blocksize ){
    var inputBuf = Buffer.concat( [knownBuf.subarray(knownBuf.length-(blocksize-1),knownBuf.length),Buffer.alloc(1,0)] );
    var codebook = [];
    for( var i=0; i<=255; i++ ){
        inputBuf[inputBuf.length-1] = i;
        var result = encryptData( inputBuf, key );
        codebook[ result.subarray(inputBuf.length - blocksize,inputBuf.length).toString('hex') ] = i;
    }
    return codebook;
}

// Detect Blocksize
var blocksize = detectBlockSize( (chosenText) => {
    return encryptData( chosenText, key );
});

// Verify ECB Mode
if( !detectECBMode( encryptData( Buffer.alloc( blocksize * 3, 'A'), key )) ){
    console.log('Exiting, attack requires ECB mode.');
    process.exit(-1);
}


var solved = Buffer.alloc( blocksize-1,'A');
var block = 0;
var complete = false;
do {
    for( var paddingSize=15; paddingSize>=0; paddingSize-- ){
        // Use padding to adjust target byte to block boundary.
        var padd = Buffer.alloc(paddingSize,'A');
        var ciphertext = encryptData( padd, key );

        // Calcuate codebook for a lookup
        var codebook = constructCodebook( solved, blocksize );

        // Solve the target byte
        var startIndex = (blocksize*block)+0;
        var endIndex = (blocksize*block)+16;
        if( endIndex < ciphertext.length ){
            var lookupValue = ciphertext.subarray(startIndex,endIndex).toString('hex');
            var value = codebook[lookupValue];

            // Add the target byte to our known text
            solved = Buffer.concat([solved,Buffer.alloc(1,value)]);
        }else{
            complete = true;
        }
    }
    block++;
}while(!complete);   // TODO: Working, but Figure out end condition!

result = solved.subarray(15,solved.length)
console.log( result.toString('utf-8') )







