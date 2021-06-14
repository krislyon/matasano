////////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C6: Break Repeating Key XOR
/////////////////////////////////////////////////////
const { calc_hamming_distance } = require('../utility/textstats');
const { transposeDataBlocks, crackSingleByteXOR, repeatingXorEncrypt } = require('../utility/xorUtils');
const fs = require('fs');

// Step1: Validate Hamming Distance Function
if( 37 != calc_hamming_distance( Buffer.from("this is a test"), Buffer.from("wokka wokka!!!")) ){
    console.log("Hamming Distance Calcuation: Broken");
    exit(-1);
}else{
    console.log("Hamming Distance Calculation: OK");
}

// Step2: Load our data, strip new lines, and base64 decode it.
var fileData = fs.readFileSync('./Set1/data/6.txt', 'ascii');
fileData = fileData.replace(/\r?\n|\r/g,"").trim();
const data = Buffer.from( fileData, 'base64');
console.log("Loaded Dataset");

// Step3: Determine Keysize candidates
const keySizeDist = [];
for( var keySize=2; keySize<=40; keySize++ ){
    var str1 = data.subarray(0,keySize);
    var str2 = data.subarray(keySize,keySize*2);
    var str3 = data.subarray(keySize*2,keySize*3);
    var str4 = data.subarray(keySize*3,keySize*4);

    var avgHammingDist =((calc_hamming_distance(str1,str2) / keySize) +
                         (calc_hamming_distance(str1,str3) / keySize) +
                         (calc_hamming_distance(str1,str4) / keySize) +
                         (calc_hamming_distance(str2,str3) / keySize) +
                         (calc_hamming_distance(str2,str4) / keySize) +
                         (calc_hamming_distance(str3,str4) / keySize)) / 7;

    keySizeDist[keySize] = { keySize, hammDist : avgHammingDist };
    //console.log( keySize + " : " + keySizeDist[keySize] );
}
const candidateKeySizes = keySizeDist.sort( (a,b) => (a.hammDist < b.hammDist) ? -1 : 1 )
    .slice(0,5)
    .map( a => a.keySize );
console.log("Calculated Keysize Candidates: " + candidateKeySizes[0] + ", " + candidateKeySizes[1] + ", "+ candidateKeySizes[2] + ", "+ candidateKeySizes[3] + ", "+ candidateKeySizes[4]);

// Step4: Break it.
var topSolution = { score: 0 };
candidateKeySizes.forEach( keySize => {
    console.log("Searching for solutions with keysize: " + keySize)

    var blockArray = transposeDataBlocks( data, keySize );
    var candidateKeylist = [];
    for( var i=0; i<blockArray.length; i++ ){
        candidateKeylist[i] = crackSingleByteXOR( blockArray[i] );
    }


    var solutionScore = 0;
    var candidateKey = "";
    candidateKeylist.forEach( keylist => {
        candidateKey += String.fromCharCode(keylist[0].key);
        solutionScore += keylist[0].score;
    });
    solutionScore = solutionScore / keySize;
    console.log('Score: ' + solutionScore + ', "' + candidateKey + '", (' + Buffer.from(candidateKey).toString('hex') + ')' );

    if( topSolution.score < solutionScore ){
        topSolution = { score: solutionScore, key: candidateKey };
    }
});

// Step 5: Output top solution
console.log("\n");
console.log( "Top scoring Solution:" );
console.log('---------------------------------------')
var result = repeatingXorEncrypt( data, Buffer.from( topSolution.key ) );
console.log( result.toString('ascii') )