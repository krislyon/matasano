const oxfordCharacterDistribution = {
    'a': 0.084966,
    'b': 0.020720,
    'c': 0.045388,
    'd': 0.036308,
    'e': 0.111607,
    'f': 0.018121,
    'g': 0.024705,
    'h': 0.030034,
    'i': 0.075488,
    'j': 0.001965,
    'k': 0.011016,
    'l': 0.054893,
    'm': 0.030129,
    'n': 0.066544,
    'o': 0.071635,
    'p': 0.031671,
    'q': 0.001962,
    'r': 0.075809,
    's': 0.057351,
    't': 0.069509,
    'u': 0.036308,
    'v': 0.010074,
    'w': 0.012899,
    'x': 0.002902,
    'y': 0.017779,
    'z': 0.002722
}

const frequency_score = (buffer) => {
    if( buffer.length == 0 ) return 0;

    const freqArray = [];
    for( var i=0;i<256;i++ ){ freqArray[i] = 0 }
    for( var i=0;i<str.length;i++ ){
        var c = buffer[i];
        freqArray[c] = freqArray[c] += 1;
    }
    for( var i=0;i<256;i++){
        freqArray[i] = freqArray[i] / buffer.length;
    }
    return freqArray;
}

const alpha_range_score = (buffer) => {
    let score = 0;
    if( buffer.length == 0 ) return 0;

    for( var i=0; i<buffer.length;i++ ){
        var c = buffer[i];
        if( in_alpha_range(c) ){
            score++;
        }
    }
    return score/buffer.length;
}

const in_alpha_range = (c) => {
    if( ((c>=48)&&(c<=57)) || ((c>=65)&&(c<=90)) || ((c>=97)&&(c<=122)) || (c==32) ){
        return true;
    }
    return false;
}

const ascii_range_score = (buffer) => {
    let score = 0;
    if( buffer.length == 0 ) return 0;

    for( var i=0; i<buffer.length;i++ ){
        var c = buffer[i];
        if( ((c>=32)&&(c<=126)) ) {
            score++;
        }
    }
    return score/buffer.length;
}

const calc_hamming_distance = (buf1,buf2) => {
    var hammingDist = 0;
    if( buf1.length != buf2.length ) return -1;

    for( var i=0; i<buf1.length; i++ ){
        var c = buf1[i] ^ buf2[i];
        for( var j=0; j<8; j++ ){
            if( c & 0x01 ){
                hammingDist += 1;
            }
            c = c >> 1;
        }
    }
    return hammingDist;
}

module.exports = {
    frequency_score,
    alpha_range_score,
    ascii_range_score,
    calc_hamming_distance,
    in_alpha_range
}