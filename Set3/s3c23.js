// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C23: Clone an MT19937 RNG from its output
/////////////////////////////////////////////////////
const { seed_mt, extract_number } = require("../utility/mt19937")

function constructSequence(){
    var sequence = [];
    seed_mt(1131464071);
    for( var i=0; i<624; i++ ){
        sequence[i] = extract_number();
    }
    return sequence;
}

function temper1(value) {
    var y = value;
    return y ^ (( y >>> 11 ) & 0xFFFFFFFF );
}

function temper2(value){
    var y = value;
    return (y ^ (( y << 7 ) & 0x9D2C5680 )) >>> 0;
}

function temper3(value){
    var y = value;
    return (y ^ (( y << 15 ) & 0xEFC60000 )) >>> 0;
}

function temper4(value){
    var y = value;
    return (y ^ ( y >>> 18 )) >>> 0;
}

function untemper4(value) {
    // Reverse Operation 4: y = y ^ ( y >>> 18 )
    return ( value ^ ( value >>> 18 )) >>> 0;
}

function untemper3( value ){
    // Reverse Operation 3: y = (y ^ (( y << 15 ) & 0xEFC60000 )) >>> 0;
    var ylow   = (value & 0x0000FFFF) >>> 0;
    var yh1 = (((value << 15) ^ value) & 0xEFC60000) >>> 0;
    var yh2 = (value & (~0xEFC60000));
    return (ylow | yh1 | yh2) >>> 0;
}

function untemper2( value ){
    // (y ^ (( y << 7 ) & 0x9D2C5680 )) >>> 0;
    var ylow =  (0x0000A97F & value);
    ylow = ( ylow | (value ^ (value << 7)) & 0x00005680)  >>> 0;
    var yhigh = ((0x62D30000 & value) | ((value ^ (ylow << 7))  & 0x9D2C0000 )) >>> 0;
    return (ylow|yhigh) >>> 0;
}
// input:      1101 1110 1010 1101 1011 1110 1110 1111  (0xDEADBEEF)
// shl7:       0101 0110 1101 1111 0111 0111 1000 0000
// and:        1001 1101 0010 1100 0101 0110 1000 0000
// tempered:   0001 0100 0000 1100 0101 0110 1000 0000

// YYYY YYYY YYYY YYYY YYYY YYYY YYYY YYYY input

// yyyy yyyy yyyy yyyy yyyy yyyy y000 0000 shl
// 1001 1101 0010 1100 0101 0110 1000 0000 and
// YYYY YYYY YYYY YYYY YYYY YYYY YYYY YYYY xor
//  ++    +  ++ +   ++ + +  +  +  +++ ++++

// x7 = y0 xor y7

// 0:
// 1:
// y7 = x7 xor y0  (x0)

// 2:
//y9  = x9  xor y2 (x2)
//y10 = x10 xor y3 (x3)
// 3:
//y12 = x12 xor y5 (x5)
//y14 = x14 xor y7 (x7)
// -----------
// 4:
//y18 = x18 xor y11 (x11)
//y19 = x19 xor y12 (above)
// 5:
//y21 = x21 xor y14 (above)

// 6:
//y24 = x24 xor y17 (x17)
//y26 = x26 xor y19 (above)
//y27 = x27 xor y20 (x20)
// 7:
//y28 = x28 xor y21 (above)
//y31 = x31 xor y24 (above)


console.log('Test Untemper 4:');
var y = 0xDEADBEEF;
var tempered = temper4(y);
var untempered = untemper4(tempered);
console.log(`Input: ${y.toString(16)}`)
console.log(`Tempered: ${tempered.toString(16)}`)
console.log(`UnTempered: ${untempered.toString(16)}`)

console.log('Test Untemper 3:');
y = 0xDEADBEEF;
tempered = temper3(y);
untempered = untemper3(tempered);
console.log(`Input: ${y.toString(16)}`)
console.log(`Tempered: ${tempered.toString(16)}`)
console.log(`UnTempered: ${untempered.toString(16)}`)

console.log('Test Untemper 2:');
y = 0xDEADBEEF;
tempered = temper2(y);
untempered = untemper2(tempered);
console.log(`Input: ${y.toString(16)}`)
console.log(`Tempered: ${tempered.toString(16)}`)
console.log(`UnTempered: ${untempered.toString(16)}`)


// input:      1101 1110 1010 1101 1011 1110 1110 1111  (0xDEADBEEF)
// shl15:      1101 1111 0111 0111 1000 0000 0000 0000
// and:        1110 1111 1100 0110 0000 0000 0000 0000  (0xEFC60000)
// res:        1100 1111 0100 0110 0000 0000 0000 0000
// xor:        1101 1110 1010 1101 1011 1110 1110 1111
// tempered:   0001 0001 1110 1011 1011 1110 1110 1111  (0x11EBBEEF)

// find ylow:
// tempered:   0001 0001 1110 1011 1011 1110 1110 1111  (0x11EBBEEF)
// and:        0000 0000 0000 0000 1111 1111 1111 1111  (0x0000FFFF)
// ylow:       0000 0000 0000 0000 1011 1110 1110 1111  (0x0000BEEF)

// find yhigh:
// shl15:      1101 1111 0111 0111 1000 0000 0000 0000
// tempered:   0001 0001 1110 1011 1011 1110 1110 1111
// xor:        1100 1110 1001 1100 0011 1110 1110 1111  (0xCE9Cxxxx)
// and:        1110 1111 1100 0110 0000 0000 0000 0000
// yh1         1100 1110 1000 0100 0000 0000 0000 0000

// temper      0001 0001 1110 1011 1011 1110 1110 1111
// and         0001 0000 0011 1001 0000 0000 0000 0000
// yh2         0001 0000 0010 1001 0000 0000 0000 0000

// yh1 | yh2   1101 1110 1010 1101 0000 0000 0000 0000
// | ylow      1101 1110 1010 1101 1011 1110 1110 1111

// input:      1101 1110 1010 1101 1011 1110 1110 1111  (0xDEADBEEF)



//  + bit equals X bit.
//         YYYYYYYY YYYYYYYY Y0000000 00000000
//   and   11101111 11000110 00000000 00000000
//--------------------------------------------
//         yyy0yyyy yy000yy0 00000000 00000000
//   xor   YYYYYYYY YYYYYYYY YYYYYYYY YYYYYYYY
//--------------------------------------------
//            +       +++  + ++++++++ ++++++++

// x17 = y2 xor y17
// x17 xor y2 = y2 xor y17 xor y2
// x17 xor y2 = y17
// y17 = x17 xor y2
// y17 = x17 xor x2 ( because x = y for low word )

//var sequence = constructSequence();
