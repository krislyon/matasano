/////////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C4: Load the datafile and find the xor-byte-encrypted string
/////////////////////////////////////////////////////
const fs = require('fs')
const readline = require('readline');
const { alpha_range_score } = require('../utility/textstats');


var lineReader = readline.createInterface({
    input: fs.createReadStream('Set1/data/4.txt')
});

const analyzeLine = (line) => {
    const encData = Buffer.from( line,'hex');
    let keyByte = 0x00;
    let i=0;
    for( keyByte = 0; keyByte<0xFF; keyByte++ ){
        let result = Buffer.alloc(encData.length);
        for(i=0;i<encData.length;i++){
            result[i] = encData[i] ^ keyByte;
        }
        var score = alpha_range_score( result );
        if(  score > 0.90 ){
            console.log( score + " : 0x" + keyByte.toString(16) + " : " + result )
        }
    }
}

lineReader.on('line', (line) => {
   analyzeLine(line);
});