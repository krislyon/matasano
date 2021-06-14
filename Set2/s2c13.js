// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C13: ECB Cut and Paste
/////////////////////////////////////////////////////
const crypto = require('crypto');
const { getMaxListeners } = require('process');
const { aes128EcbDecrypt, aes128EcbEncrypt, detectBlockSize, detectECBMode } = require('../utility/blockUtils')
var aesKey = crypto.randomBytes(16);

function kv_decode(kvString) {
    return kvString.split('&')
        .map( (pair) => {
            kv = pair.split('=');
            return {  [kv[0]] : kv[1] }
        }).
        reduce( (previous,current) => {
            return { ...current, ...previous };
        });
}

function kv_encode(obj){
    var result = "";
    for( prop in obj ){
        result += `${prop}=${obj[prop]}&`;
    }
    result = result.substring(0,result.length-1);
    return result;
}

function profileFor( inputEmail ){
    if( inputEmail.includes('&') || inputEmail.includes('=') ){
        throw 'Invalid characters in email address';
    }
    var userProfile = {
        email: inputEmail,
        uid: 10,
        role: 'user'
    }
    return kv_encode( userProfile );
}

function encryptProfile( profileString, key ){
    return aes128EcbEncrypt( profileString, key );
}

function decryptProfile( ciphertext, key ){
    return aes128EcbDecrypt( ciphertext, key ).toString('utf-8');
}

function oracle(email){
    return encryptProfile( Buffer.from( profileFor(email)), aesKey );
}


var adminProfile = oracle("kris.lyon@gmail.com");

// Detect the Blocksize
var blocksize = detectBlockSize( (chosenText) => {
    return oracle( chosenText );
});

// Detect ECB
if( !detectECBMode( oracle( Buffer.alloc( blocksize * 3, 'A').toString('utf-8') )) ){
    console.log('Exiting, attack requires ECB mode.');
    process.exit(-1);
}

// Craft time, cut and paste the blocks...
// Part1: email=xxxxxxxxxx xxx&uid=10&role= user      // block 1 & 2
// Part2: email=xxxxxxxxxx admin&uid=10&rol e=user    // block 2.
// Part3: email=xxxxxxxxxx xxxx&uid=10&role =user     // block 3

// Part1: Email must be 13 chars, grab block 1 & 2
var part1 = oracle('aaaaaaaaaaaaa');
part1 = part1.subarray(0,32);

// Part2: Email must be 15 chars and end with admin, grab block 2
var part2 = oracle( 'aaaaaaaaaaadmin' );
part2 = part2.subarray(16,32);

// Part3: Email must be 14 chars, grab block 3
var part3 = oracle('aaaaaaaaaaaaaa')
part3 = part3.subarray(32,48);

adminProfile = Buffer.concat([part1,part2,part3]);

var decProfile = decryptProfile( adminProfile, aesKey );
console.dir( decProfile );

console.log( 'Crafted admin profile: ');
console.log( "Admin Profile for current key" + adminProfile.toString('hex') );
console.log( "Profile String: " + decProfile );
console.log( "Profile Obj:");
var profileObj = kv_decode(decProfile);
for( prop in profileObj ){
    console.log(`${prop} : ${profileObj[prop]}`)
}