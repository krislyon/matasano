const { alpha_range_score } = require('./textstats');

const createXorKeyStream = (buffer) => {
    var keyStream = new Object();
    keyStream.key = buffer;
    keyStream.index = 0;
    keyStream.next = function(){
        return this.key[( this.index++ % this.key.length )];
    };
    keyStream.reset = function(){
        this.index = 0;
    };
    keyStream.skip = function(pos){
        this.index = pos;
    };
    return keyStream;
}

const createByteStream = (buffer) => {
    var dataStream = new Object();
    dataStream.data = buffer;
    dataStream.index = 0;
    dataStream.next = function(){
        if( this.index == this.data.length ) return -1;
        return this.data[this.index++];
    };
    dataStream.reset = function(){
        this.index = 0;
    };
    dataStream.skip = function(pos){
        this.index = pos;
    };
    dataStream.available = function(){
        return !(this.index == this.data.length);
    }
    return dataStream;
}

const transposeDataBlocks = (buffer,size) => {
    const blockArray = [];
    for(var i=0; i<size; i++ ){
        var block = Buffer.alloc( Math.ceil((buffer.length - i)/size) );
        for( var j=0; ((j*size)+i)<buffer.length; j++ ){
            block[j] = buffer[(j*size)+i];
        }
        blockArray[i] = block;
    }
    return blockArray;
}

const crackSingleByteXor = (buffer, count = 1, threshold = 0 ) => {
    var resultArray = [];
    for( var keyByte = 0; keyByte<0xFF; keyByte++ ){
        let result = Buffer.alloc(buffer.length);
        for( var i=0;i<buffer.length;i++){
            result[i] = buffer[i] ^ keyByte;
        }
        var score = alpha_range_score( result );
        if( score > threshold ){
            resultArray.push({ key: keyByte, score });
        }
    }
    var resultCount = ( resultArray.length > count ) ? count : resultArray.length;
    return resultArray.sort( (a,b) => a.score < b.score ? 1 : -1 ).slice(0, resultCount);
}

const repeatingBufferXor = (dataBuffer,keyBuffer) => {
    const ks = createXorKeyStream(keyBuffer);
    const ds = createByteStream(dataBuffer);
    const result = Buffer.alloc( dataBuffer.length );

    var i=0;
    while( ds.available() ){
        result[i++] = ds.next() ^ ks.next();
    }
    return result;
}

const bufferXor = (dataBuffer,keyBuffer) => {
    if( dataBuffer.length != keyBuffer.length ){
        throw 'xorBuffer() failed, unequal buffer lengths.'
    }
    return repeatingBufferXor( dataBuffer, keyBuffer );
}

module.exports = {
    createXorKeyStream,
    createByteStream,
    transposeDataBlocks,
    crackSingleByteXor,
    repeatingBufferXor,
    bufferXor,
}