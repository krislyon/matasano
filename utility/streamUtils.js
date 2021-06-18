const crypto = require("crypto");

function getAes128CTRCipher( key, iv, leNonce, enableLog = false, counter = Buffer.alloc(8,0) ){
    var aes128Ctr = new Object();
    aes128Ctr.key = key;
    aes128Ctr.iv = iv;
    aes128Ctr.cipher = crypto.createCipheriv( "aes-128-ecb", key, null );
    aes128Ctr.cipher.setAutoPadding( false );
    aes128Ctr.stream = Buffer.alloc(0);
    aes128Ctr.counter = Buffer.alloc(16);
    leNonce.copy( aes128Ctr.counter, 0 );
    counter.copy( aes128Ctr.counter, 8 );

    aes128Ctr.update = function( plaintextBuffer ){
        var ciphertext = Buffer.alloc(plaintextBuffer.length );

        // create required stream data
        while( this.stream.length < plaintextBuffer.length ){
            this.next();
        }

        // XOR Encrypt Plaintext with Byte Stream
        for( var i=0; i<=plaintextBuffer.length; i++ ){
            ciphertext[i] = plaintextBuffer[i] ^ this.stream[i];
        }

        // Clear used bytes from stream.
        this.stream = Buffer.from( this.stream.subarray(plaintextBuffer.length,this.stream.length) );

        return ciphertext;
    };

    aes128Ctr.next = function(){
        // Add to stream.
        var output = this.cipher.update(this.counter);
        this.stream = Buffer.concat( [this.stream,output] );

        if( enableLog ){
            console.log(`ctr: ${this.counter.toString('hex')} --> ks: ${output.toString('hex')}`)
        }

        // increment counter bytes
        var i=8;
        do{
            this.counter[i]++
        }while( i<=15 && this.counter[i++] == 0x00 )
    };

    aes128Ctr.close = function(){
        this.cipher.final();
        this.cipher = null;
        this.stream.fill(0xff);
        this.stream = null;
        this.counter.fill(0xff);
        this.counter = null;
        this.key.fill(0xff);
        this.key = null;
        this.iv.fill(0xff);
        this.iv = null;
    };

    return aes128Ctr;
}


module.exports = {
    getAes128CTRCipher,
}