// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C9: PKCS#7 Padding
/////////////////////////////////////////////////////
function pkcs7pad(buffer,blocksize){
    const padBuffer = Buffer.from('04040404040404040404040404040404','hex');
    const pad = blocksize - (buffer.length % blocksize);
    return Buffer.concat( [buffer, padBuffer.subarray(0,pad)] );
}

function paddingTest( text, blocksize ){
    const result = pkcs7pad( Buffer.from(text), blocksize );
    console.log( result.toString('hex') );
}

paddingTest('A',8);
paddingTest('AA',8);
paddingTest('AAAAAAA',8);
paddingTest('AAAAAAAA',8);
paddingTest('AAAAAAAAA',8);
paddingTest('AAAAAAAAAAAA',8);
paddingTest('AAAAAAAAAAAAAAA',8);
paddingTest('AAAAAAAAAAAAAAAA',8);
paddingTest('AAAAAAAAAAAAAAAAA',8);
paddingTest('AAAAAAAAAAAAAAAAAAAAAAAA',8);
paddingTest('AAAAAAAAAAAAAAAAAAAAAAAAA',8);