function applyPkcs7Padding(buffer,blocksize, log = false){
    var pad = blocksize - (buffer.length % blocksize);
    pad = (pad == 0) ? blocksize : pad;
    if( log == true ){
        console.log(`Applying ${pad} bytes of padding`);
    }
    const padBuffer = Buffer.alloc(blocksize,pad);
    return Buffer.concat( [buffer, padBuffer.subarray(0,pad)] );
}

function removePkcs7Padding( input ){
    var count = input[input.length-1];
    if( count == 0 ) throw 'Invalid PKCS7 Padding'

    for( var i=1; i<=count; i++ ){
        if( input[input.length-i] != count ){
            throw 'Invalid PKCS7 Padding';
        }
    }
    console.log( Buffer.from( input.subarray(input.length-16,input.length)).toString('hex') );
    return input.subarray(0,input.length-count);
}

module.exports = {
    applyPkcs7Padding,
    removePkcs7Padding,
}