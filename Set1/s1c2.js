// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C2: XOR the two strings together, output the result.
/////////////////////////////////////////////////////

const buf1 = Buffer.from( "1c0111001f010100061a024b53535009181c", 'hex');
const buf2 = Buffer.from( "686974207468652062756c6c277320657965", 'hex');

if( buf1.length != buf2.length ){
    console.log("Cannot process, buffers have different lengths.");
    exit(1);
}

const resultArray = Buffer.alloc( buf1.length );
let i=0;
for( i=0; i<buf1.length; i++ ){
    resultArray[i] = buf1[i] ^ buf2[i];
}

console.log( resultArray.toString('hex') );

