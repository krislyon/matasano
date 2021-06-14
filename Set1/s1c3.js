// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S1C3: Output hexData as base64
/////////////////////////////////////////////////////

//const { alpha_range_score } = require('../../utility/textstats');
// const encData = Buffer.from( "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736",'hex');
// let keyByte = 0x00;
// let i=0;
// for( keyByte = 0; keyByte<0xFF; keyByte++ ){
//     let result = Buffer.alloc(encData.length);
//     for(i=0;i<encData.length;i++){
//         result[i] = encData[i] ^ keyByte;
//     }
//     var score = alpha_range_score( result.toString() );
//     if(  score > 0.90 ){
//         console.log( score + " : 0x" + keyByte.toString(16) + " : " + result )
//     }
// }

const { crackSingleByteXOR, repeatingXorEncrypt } = require('../../utility/xorUtils');

const encData = Buffer.from( "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736",'hex');
var result = crackSingleByteXOR( encData );

console.log('Suspected Key: 0x' + Buffer.from( String.fromCharCode(result[0].key) ).toString('hex') );
var output = repeatingXorEncrypt( encData, Buffer.from( String.fromCharCode(result[0].key) ));
console.log( "Result: '" + output.toString('ascii') + "'");



