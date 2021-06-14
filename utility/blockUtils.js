const crypto = require('crypto')
const { repeatingXorEncrypt } = require('./xorUtils')
const { applyPkcs7Padding } = require('./pkcs7')

const createBlockStream = (buffer, blocksize) => {
    var blockStream = new Object();
    blockStream.data = buffer;
    blockStream.blocksize = blocksize;
    blockStream.index = 0;
    blockStream.next = function(){
        if( this.available() ){
            var endIndex = (this.index * blocksize) + blocksize;
            endIndex = (endIndex < this.data.length) ? endIndex : this.data.length;
            var result = Buffer.from( this.data.subarray( this.index * blocksize, endIndex ) );
            this.index++;
            return result;
        }
        throw 'Attempted to read beyond end of blockstream.'
    };
    blockStream.reset = function(){
        this.index = 0;
    };
    blockStream.skip = function(pos){
        this.index = pos;
    };
    blockStream.available = function(){
        return !(this.index * this.blocksize >= this.data.length);
    }
    return blockStream;
}

const getBlockArray = (buffer,blocksize,applyPadding) => {
    var blocks = [];
    if( applyPadding ){
        buffer = applyPkcs7Padding( buffer, blocksize );
    }
    for( var i=0; i<(buffer.length/blocksize); i++ ){
        blocks[i] = buffer.subarray(i*blocksize,(i*blocksize)+blocksize);
    }
    return blocks;
}

const aes128EcbDecrypt = (ciphertext,key, iv = null, enablePadding = true) => {
    var bs = createBlockStream( ciphertext, 16 );
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv );
    decipher.setAutoPadding( enablePadding );
    var plaintext = Buffer.alloc(0);
    while( bs.available() ){
        plaintext = Buffer.concat([ plaintext, decipher.update( bs.next() ) ]);
    }
    plaintext = Buffer.concat( [plaintext,decipher.final()]);
    return plaintext;
}

const aes128EcbEncrypt = (plaintext,key, iv = null, enablePadding = true) => {
    var bs = createBlockStream( plaintext, 16 );
    var cipher = crypto.createCipheriv('aes-128-ecb', key, iv );
    cipher.setAutoPadding( enablePadding );
    var ciphertext = Buffer.alloc(0);
    while( bs.available() ){
        ciphertext = Buffer.concat( [ciphertext, cipher.update( bs.next() )] );
    }
    ciphertext = Buffer.concat( [ciphertext,cipher.final()] );
    return ciphertext;
}

const aes128EncryptManualCBC = (plaintext,key,iv,enablePadding = true) => {
    var bs = createBlockStream( plaintext, 16 );
    var cipher = crypto.createCipheriv('aes-128-ecb', key, null );
    cipher.setAutoPadding( enablePadding );
    var ciphertext = Buffer.alloc(0);
    var lastBlock = iv;
    while( bs.available() ){
        var block = bs.next();
        block = repeatingXorEncrypt( block, lastBlock );
        lastBlock = cipher.update( block );
        ciphertext = Buffer.concat([ciphertext,lastBlock]);
    }
    ciphertext = Buffer.concat([ciphertext,cipher.final()]);
    return ciphertext;
}

const aes128DecryptManualCBC = (ciphertext,key,iv,enablePadding = true) => {
    var bs = createBlockStream( ciphertext, 16 );
    var cipher = crypto.createDecipheriv('aes-128-ecb', key, null );
    cipher.setAutoPadding( enablePadding );
    var plaintext = Buffer.alloc(0);
    var lastBlock = iv;
    while( bs.available() ){
        var ciphertextBlock = bs.next();
        var result = cipher.update( ciphertextBlock );
        plaintext = Buffer.concat([plaintext,repeatingXorEncrypt( result, lastBlock )]);
        lastBlock = ciphertextBlock;
    }
    plaintext = Buffer.concat([plaintext,cipher.final()]);
    return plaintext;
}

//
// Analyze ciphertext to see if ECB mode can be detected.
// Looks for repeated blocks.
//
// If plaintext can be chosen, call with with a repeated
// sequence of characters 3 x blocksize in length.
//
function detectECBMode(ciphertext){
    var matchCount = 0;
    const blocks = getBlockArray( ciphertext, 16 );
    for( var i=0; i<blocks.length; i++ ){
        for( var j=i+1; j<blocks.length; j++ ){
            if( blocks[i].compare(blocks[j]) == 0 ){
                matchCount++;
                //console.log(`Block: ${i} matched Block: ${j}`)
            }
        }
    }
    // Match count will be positive if ECB Mode is detected.
    if( matchCount > 0 ){
        console.log("Cipher Mode Detection: ECB Mode Detected.");
    }else{
        console.log("Cipher Mode Detection: CBC Mode Detected.");
    }
    return matchCount;
}

function detectBlockSize( cipher, maxBlockSize = 256 ){
    var firstBlockIncrease = 0;
    var lastLength = cipher( Buffer.from("") ).length;

    for( var count = 1; count < maxBlockSize; count++ ){
        var chosenText = Buffer.alloc(count,'A');
        var result = cipher(chosenText);

        if( result.length > lastLength && firstBlockIncrease == 0){
            console.log(`Block Size Detection: Found first increase at count: ${count}`)
            firstBlockIncrease = count;
            lastLength = result.length;
        }
        if( result.length > lastLength && firstBlockIncrease != 0){
            console.log(`Block Size Detection: Found second increase at count: ${count}`);
            console.log(`Block Size Detection: Blocksize detected as: ${count - firstBlockIncrease}`);
            return count - firstBlockIncrease;
        }
    }
    return 0;
}

module.exports = {
    createBlockStream,
    aes128EcbDecrypt,
    aes128EcbEncrypt,
    aes128EncryptManualCBC,
    aes128DecryptManualCBC,
    getBlockArray,
    detectECBMode,
    detectBlockSize,
}