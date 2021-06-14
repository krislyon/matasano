// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C14: Byte at a time ECB Decryption (part2)
//
// I've included two versions because there was some abiguity in the description.
//  - This version assumes the random bytes are static.
//
/////////////////////////////////////////////////////
const crypto = require('crypto');
const { aes128EcbEncrypt, detectBlockSize, detectECBMode, getBlockArray } = require('../utility/blockUtils');

function getRandomInt(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor( Math.random() * (max-min+1)) + min;
}

var key = crypto.randomBytes(16);
var randomPrefix = crypto.randomBytes( getRandomInt(0,128) );
//var randomPrefix = crypto.randomBytes( 25 );
console.log( 'using random prefix of length: ' + randomPrefix.length );

function encryptData(plaintext,key,log=false){
    var data = Buffer.from("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK",'base64');
    var pt = Buffer.concat( [randomPrefix,plaintext,data] );
    var ciphertext = aes128EcbEncrypt( pt, key, null, true );

    if( log ) {
        console.log(`Input:   Prefix: ${randomPrefix.length}, attacker: ${plaintext.length}, data: ${data.length}.`);
        console.log(`Output: ${ciphertext.length}`);
    }
    return ciphertext;
}

function constructCodebook( knownBuf, blocksize, offset, minPad ){
    var inputBuf = Buffer.concat( [knownBuf.subarray(knownBuf.length-(blocksize-1)-minPad,knownBuf.length),Buffer.alloc(1,0)] );
    var codebook = [];
    for( var i=0; i<=255; i++ ){
        inputBuf[inputBuf.length-1] = i;
        var result = encryptData( inputBuf, key, false);
        codebook[ result.subarray( offset, offset + blocksize ).toString('hex')] = i;
    }
    return codebook;
}

// Use a modified version of the ECB Detection to determine byte lengths
function detectPrefixLength(){

    var count = blocksize * 2;
    var lastBlockMatchStart = 0;
    var complete = false;
    do{
        var ciphertext = encryptData( Buffer.alloc( count, 'A'), key );
        var matchCount = 0;

        const blocks = getBlockArray( ciphertext, 16 );
        for( var i=0; i<blocks.length; i++ ){
            for( var j=i+1; j<blocks.length; j++ ){
                if( blocks[i].compare(blocks[j]) == 0 ){
                    matchCount++;
                    lastBlockMatchStart = j;
                }
            }
        }

        if( matchCount > 0 ){
            complete = true;
            // count is now equal to the number of bytes we had to add to force a duplicate block.
            /// (z) - random bytes, (t) - target bytes, using blocksize = 8 for readability here.
            // case1: random bytes are not-block aligned  zzzzAAAA AAAAAAAA AAAAAAAA tttttttt
            // case2: random bytes are block-aligned      zzzzzzzz AAAAAAAA AAAAAAAA tttttttt

            // randomByteLength = (lastBlockMatchStart * blocksize) - (count - blocksize);

            return ( lastBlockMatchStart * blocksize ) - ( count - blocksize );
        }
        count++;
    }while( complete == false );

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

// Detect Prefix Length
var prefixLength = detectPrefixLength();
var minPad = blocksize - (prefixLength % blocksize);
var offset = prefixLength + minPad;

console.log(`Detected random prefix length as: ${prefixLength}`);
console.log(`Block alignment adjustment is: ${minPad}`);
console.log(`Offset: ${offset}`);

var solved = Buffer.alloc( blocksize-1 + minPad,'A');
var block = 0;
var complete = false;

do {
    for( var paddingSize=15; paddingSize>=0; paddingSize-- ){
        // Use padding to adjust target byte to block boundary,
        // adjust for random-byte offset with minPad.
        var padd = Buffer.alloc( minPad + paddingSize,'A');
        var ciphertext = encryptData( padd, key, false );

        // Calcuate codebook for a lookup
        var codebook = constructCodebook( solved, blocksize, offset, minPad );

        // Solve the target byte
        var startIndex = (offset) + (blocksize*block)+0;
        var endIndex = (offset) + (blocksize*block)+16;
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

result = solved.subarray(15+minPad,solved.length)
console.log("Result");
console.log("-------------------------------");
console.log( result.toString('utf-8') )

