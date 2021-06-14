// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C15: PKCS#7 Padding Validation
/////////////////////////////////////////////////////

const { removePkcs7Padding, applyPkcs7Padding } = require('../utility/pkcs7')

try{
    var input = applyPkcs7Padding( Buffer.from('ICE ICE BABY'), 16 );
    removePkcs7Padding( input );
    console.log('Valid Padding');
}catch( err ){
    console.log(err);
}

try{
    // Should throw an exception.
    removePkcs7Padding( Buffer.from("ICE ICE BABY\x05\x05\x05\x05") );
    console.log('Valid Padding');
}catch( err ){
    console.log(err);
}

try{
    // Should throw an exception.
    removePkcs7Padding( Buffer.from("ICE ICE BABY\x01\x02\x03\x04") );
    console.log('Valid Padding');
}catch( err ){
    console.log(err);
}