function applyPkcs7Padding(buffer,blocksize){
    var pad = blocksize - (buffer.length % blocksize);
    pad = (pad == 0) ? blocksize : pad;
    const padBuffer = Buffer.alloc(blocksize,pad);
    return Buffer.concat( [buffer, padBuffer.subarray(0,pad)] );
}

function removePkcs7Padding( input ){
    var count = input[input.length-1];
    for( var i=1; i<=count; i++ ){
        if( input[input.length-i] != count ){
            throw 'Invalid PKCS7 Padding';
        }
    }
    return input.subarray(0,input.length-count);
}

module.exports = {
    applyPkcs7Padding,
    removePkcs7Padding,
}