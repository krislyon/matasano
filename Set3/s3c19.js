// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C19: Breaking fixed-nonce CTR mode with substitution
/////////////////////////////////////////////////////
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const crypto = require('crypto')
const {getAes128CTRCipher} = require('../utility/streamUtils')
const {in_alpha_range, frequency_score } = require('../utility/textstats')
const {digraphArray} = require('../utility/freqEn');

var plaintexts = ["SSBoYXZlIG1ldCB0aGVtIGF0IGNsb3NlIG9mIGRheQ==",
"Q29taW5nIHdpdGggdml2aWQgZmFjZXM=",
"RnJvbSBjb3VudGVyIG9yIGRlc2sgYW1vbmcgZ3JleQ==",
"RWlnaHRlZW50aC1jZW50dXJ5IGhvdXNlcy4=",
"SSBoYXZlIHBhc3NlZCB3aXRoIGEgbm9kIG9mIHRoZSBoZWFk",
"T3IgcG9saXRlIG1lYW5pbmdsZXNzIHdvcmRzLA==",
"T3IgaGF2ZSBsaW5nZXJlZCBhd2hpbGUgYW5kIHNhaWQ=",
"UG9saXRlIG1lYW5pbmdsZXNzIHdvcmRzLA==",
"QW5kIHRob3VnaHQgYmVmb3JlIEkgaGFkIGRvbmU=",
"T2YgYSBtb2NraW5nIHRhbGUgb3IgYSBnaWJl",
"VG8gcGxlYXNlIGEgY29tcGFuaW9u",
"QXJvdW5kIHRoZSBmaXJlIGF0IHRoZSBjbHViLA==",
"QmVpbmcgY2VydGFpbiB0aGF0IHRoZXkgYW5kIEk=",
"QnV0IGxpdmVkIHdoZXJlIG1vdGxleSBpcyB3b3JuOg==",
"QWxsIGNoYW5nZWQsIGNoYW5nZWQgdXR0ZXJseTo=",
"QSB0ZXJyaWJsZSBiZWF1dHkgaXMgYm9ybi4=",
"VGhhdCB3b21hbidzIGRheXMgd2VyZSBzcGVudA==",
"SW4gaWdub3JhbnQgZ29vZCB3aWxsLA==",
"SGVyIG5pZ2h0cyBpbiBhcmd1bWVudA==",
"VW50aWwgaGVyIHZvaWNlIGdyZXcgc2hyaWxsLg==",
"V2hhdCB2b2ljZSBtb3JlIHN3ZWV0IHRoYW4gaGVycw==",
"V2hlbiB5b3VuZyBhbmQgYmVhdXRpZnVsLA==",
"U2hlIHJvZGUgdG8gaGFycmllcnM/",
"VGhpcyBtYW4gaGFkIGtlcHQgYSBzY2hvb2w=",
"QW5kIHJvZGUgb3VyIHdpbmdlZCBob3JzZS4=",
"VGhpcyBvdGhlciBoaXMgaGVscGVyIGFuZCBmcmllbmQ=",
"V2FzIGNvbWluZyBpbnRvIGhpcyBmb3JjZTs=",
"SGUgbWlnaHQgaGF2ZSB3b24gZmFtZSBpbiB0aGUgZW5kLA==",
"U28gc2Vuc2l0aXZlIGhpcyBuYXR1cmUgc2VlbWVkLA==",
"U28gZGFyaW5nIGFuZCBzd2VldCBoaXMgdGhvdWdodC4=",
"VGhpcyBvdGhlciBtYW4gSSBoYWQgZHJlYW1lZA==",
"QSBkcnVua2VuLCB2YWluLWdsb3Jpb3VzIGxvdXQu",
"SGUgaGFkIGRvbmUgbW9zdCBiaXR0ZXIgd3Jvbmc=",
"VG8gc29tZSB3aG8gYXJlIG5lYXIgbXkgaGVhcnQs",
"WWV0IEkgbnVtYmVyIGhpbSBpbiB0aGUgc29uZzs=",
"SGUsIHRvbywgaGFzIHJlc2lnbmVkIGhpcyBwYXJ0",
"SW4gdGhlIGNhc3VhbCBjb21lZHk7",
"SGUsIHRvbywgaGFzIGJlZW4gY2hhbmdlZCBpbiBoaXMgdHVybiw=",
"VHJhbnNmb3JtZWQgdXR0ZXJseTo=",
"QSB0ZXJyaWJsZSBiZWF1dHkgaXMgYm9ybi4="];

var key = crypto.randomBytes(16);
var nonce = Buffer.alloc(8,0x00);

var ciphertexts = plaintexts.map( (pt) => Buffer.from(pt,"base64") )
                            .map( (ptBuff) => {
                                var cipher = getAes128CTRCipher( key, null, nonce, true );
                                return cipher.update(ptBuff);
                            });

// -------------------------------------


// what byte when xored with ( pos x ) results in a high count of numbers in the ascii range.


function performSingleByteRecovery( ciphertexts, maxLength, count ){
    var result = [];
    for( targetByteIndex = 0; targetByteIndex < maxLength; targetByteIndex++ ){
        var kbGuess = [];
        for( var i=0; i<=255; i++ ){
            kbGuess[i] = {
                count: 0,
                value: i,
                ctcount: 0,
            }
        }

        for( var byteGuess=0; byteGuess<=255; byteGuess++ ){
            for( const ct of ciphertexts ){
                if( ct.length > targetByteIndex ){
                    kbGuess[byteGuess].ctcount++;
                    var pt = ct[targetByteIndex] ^ byteGuess;
                    if( in_alpha_range(pt) ){
                        kbGuess[byteGuess].count++;
                    }
                }
            }
        }

        // Keep the top 5 guesses.
        kbGuess = kbGuess.sort( (a,b) => {
            return ( (a.count/a.ctcount) > (b.count/b.ctcount) ) ? -1 : 1;
        }).slice(0,count);

        result[targetByteIndex] = kbGuess;
    }
    return result;
}

function performDigraphEnhancement( singleByteResult, ciphertexts, maxLength ){
    var result = Buffer.alloc(maxLength,0);
    var guessCount = singleByteResult[0].length;

    for( targetByteIndex = 0; targetByteIndex < maxLength-1; targetByteIndex+=1 ){

        var maxScore = 0;
        for( var i=0; i<guessCount; i++ ){
            for( var j=0; j<guessCount; j++ ){
                var score = 0;
                var count = 0;
                var byteAGuess = 0;
                var byteBGuess = 0;
                for( const ct of ciphertexts ){
                    if( ct.length > targetByteIndex+1 ){
                        byteAGuess = singleByteResult[targetByteIndex][i].value;
                        byteBGuess = singleByteResult[targetByteIndex+1][j].value;
                        var ptA = ct[targetByteIndex]   ^ byteAGuess;
                        var ptB = ct[targetByteIndex+1] ^ byteBGuess;
                        var digraphString = Buffer.from( ptA.toString(16).padStart(2, '0') + ptB.toString(16).padStart(2, '0'),"hex" ).toString('utf-8').toLowerCase();

                        var frequency = digraphArray.find( el => {
                            if( el[0] == digraphString ){
                                return true;
                            }
                            return false;
                        });

                        if( frequency ){
                            score += frequency[1];
                            count++;
                        }
                    }
                }
                if( score > maxScore ){
                    maxScore = score;
                    result[targetByteIndex] = byteAGuess;
                    result[targetByteIndex+1] = byteBGuess;
                }
            }
        }
    }
    return result;
}

function recoverKeyStream(ciphertexts){
    // Determine the max-length ciphertext
    var maxLength = ciphertexts.reduce( (acc,cur) => {
        return (acc > cur.length) ? acc : cur.length
    }, 0 );

    // Recover keystream.
    var singleByteResult = performSingleByteRecovery(ciphertexts, maxLength, 5);
    recoveredStream = performDigraphEnhancement( singleByteResult, ciphertexts, maxLength );
    return recoveredStream;
}

var cipher = getAes128CTRCipher( key, null, nonce, true );
cipher.next();
cipher.next();
cipher.next();

var result = recoverKeyStream( ciphertexts );
var actual = cipher.stream.subarray(0,result.length);

var diffCount = 0;
for( i=0; i<actual.length;i++ ){
    if( actual[i] != result[i] ){
        diffCount++;
    }
}

console.log(`ACTUAL: ${actual.toString('hex')}`);
console.log(`RECVRD: ${result.toString('hex')}`);
console.log(`Diffs: ${diffCount}  (${1-(diffCount/actual.length)} correct.)`);
