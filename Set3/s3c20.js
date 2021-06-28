// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C20: Breaking fixed-nonce CTR mode with repeating XOR solution.
/////////////////////////////////////////////////////
const fs = require('fs')
const readline = require('readline');
const {crackSingleByteXor, transposeDataBlocks, repeatingBufferXor} = require('../utility/xorUtils')

var ciphertexts = [];

async function loadCiphertexts() {
    const fileStream = fs.createReadStream('Set3/data/20.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    for await ( const line of rl ){
        //console.log(line);
        const data = Buffer.from( line,'base64');
        ciphertexts.push(data);
    }
    return ciphertexts.length;
}

loadCiphertexts().then( () => {
    var keySize = ciphertexts.reduce( (acc,cur) => {
        return (acc > cur.length) ? cur.length : acc;
    }, 10000 );

    console.log(`Minimum Message Length: ${keySize}`);

    // concatenate the first 53 bytes of each message.
    var concatenatedText = ciphertexts.reduce( (acc,cur) => {
        return Buffer.concat([acc,cur.subarray(0,keySize)]);
    }, Buffer.alloc(0) );

    var blockArray = transposeDataBlocks( concatenatedText, keySize );
    var candidateKeylist = [];
    for( var i=0; i<blockArray.length; i++ ){
        candidateKeylist[i] = crackSingleByteXor( blockArray[i] );
    }

    var candidateKey = "";
    candidateKeylist.forEach( keylist => {
        candidateKey += String.fromCharCode(keylist[0].key);
    });


    // Step 5: Output top solution
    console.log('---------------------------------------')
    for( var i=0; i<ciphertexts.length; i++ ){
        console.log( repeatingBufferXor( ciphertexts[i].subarray(0,keySize), Buffer.from( candidateKey ) ).toString('utf-8') );
    }


});






