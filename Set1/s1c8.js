////////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C8: Detect AES ECB Mode
/////////////////////////////////////////////////////
const fs = require('fs')
const readline = require('readline');

var lineReader = readline.createInterface({
    input: fs.createReadStream('./Set1/data/8.txt')
});

function detectAESECB( data ){
    var blockCount = data.length / 16;
    var matchCount = 0;
    for( var i=0; i<blockCount; i++ ){
        const block = data.subarray( i * 16, (i * 16) + 16);
        console.log('i: ' + i + ' ' + block.toString('hex') );

        for( var j=0; j<blockCount; j++ ){
            const candidate = data.subarray( j * 16, (j * 16) + 16 );
            if( (i != j) && block.compare(candidate) == 0 ){
                matchCount++;
                if( matchCount == 1 ){
                    console.log( 'Detected AES-ECB, block repetition in ciphertext.');
                }
                console.log( 'Repeated Block: ' + block.toString('hex') );
            }
        }
    }
}

lineReader.on( 'line', (line) => {
    detectAESECB( Buffer.from(line,'hex') );
}).on( 'close', () => {
    console.log('Done.');
});