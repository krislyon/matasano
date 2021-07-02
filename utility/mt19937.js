// Generator Configuration
const w             = 32;           // w (in number of bits)
const n             = 624;          // degree of recurrence
const m             = 397;          // middle word (used in n relation)
const r             = 31;           // separation point of one word
const a             = 0x9908B0DF;   // aicients of the rational normal form twist matrix
const u             = 11;           // additional Mersenne Twister tempering bitshift/mask
const d             = 0xFFFFFFFF;   // additional Mersenne Twister tempering bitshift/mask
const s             = 7;            // tempering bit shift
const b             = 0x9D2C5680;   // tempering bit mask
const t             = 15;           // tempering bit shift
const c             = 0xEFC60000;   // tempering bit mask
const l             = 18;           // additional Mersenne Twister tempering bitshift/mask
const f             = 1812433253;   // constant
const wordsizeMask  = 0xFFFFFFFF;

// Generator State
var MT = Array(n).fill(0);
var index = n+1;
const upper_mask = 0x80000000;
const lower_mask = 0x7FFFFFFF;

function seed_mt( seed ){
    index = n;
    MT[0] = seed >>> 0;
    for( var i=1; i<n; i++ ){
        MT[i] = ( MT[i-1] >>> 30 );
        MT[i] = MT[i-1] ^ MT[i];
        MT[i] = ((((MT[i] & 0xffff0000) >>> 16) * f ) << 16) + (( MT[i] & 0x0000ffff ) * f )
        MT[i] = (MT[i] + i) >>> 0;
    }
}

function set_active_state( state, idx=0 ){
    if( MT.length != state.length ){
        throw `Incorrect state length.  Length was: ${state.length}, but expected: ${MT.length}`
    }
    for( var i=0; i<state.length; i++ ){
        MT[i]=state[i];
    }
    index = idx;
}

function get_active_state() {
    var state = [];
    for( var i=0; i<MT.length; i++ ){
        state[i] = MT[i];
    }
    return {
        state,
        idx: index
    }
}

function twist() {
    for( var i=0; i<n; i++ ){

        var x = ( MT[i] & upper_mask ) + ( MT[(i+1) % n] & lower_mask );
        var xA = (x >>> 1);
        if( (x % 2) != 0 ){
            xA = xA ^ a;
        }
        MT[i] = (MT[(i+m) % n] ^ xA) >>> 0;
    }
    index = 0;
}

function extract_number(){
    if( index >= n ){
        if( index > n ){
            throw 'Generator was never seeded.'
            // alternatively seed with constant value: 5489 was used in reference C code.
        }
        twist();
    }

    var y = MT[index++];
    y = y ^ (( y >>> u ) & d );
    y = (y ^ (( y << s ) & b )) >>> 0;
    y = (y ^ (( y << t ) & c )) >>> 0;
    y = y ^ ( y >>> l );
    return y >>> 0;
}



module.exports = {
    seed_mt,
    set_active_state,
    get_active_state,
    extract_number
}
