// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C21: MT19937 Mersenne Twister RNG
/////////////////////////////////////////////////////
const { seed_mt, set_active_state, extract_number, get_active_state } = require("../utility/mt19937")
const fs = require('fs')
const readline = require('readline');
var testVector = [];

async function loadTestVector() {
    const fileStream = fs.createReadStream('Set3/data/mt19937-testvector.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    var skipFirst = true;
    for await ( const line of rl ){
        if( skipFirst ){
            skipFirst = false;
        }else{
            const data = parseInt( line, 10 );
            testVector.push(data);
        }
    }
    return testVector.length;
}


loadTestVector().then( () => {
    seed_mt(1131464071);
    var st = get_active_state();            // Extract the state
    set_active_state( st.state, st.idx );   // Reload the state

    for( var j=0; j<testVector.length; j++ ){
        var output = extract_number();
        if( output == testVector[j] ){
            console.log(`${j}: ${output} == ${testVector[j]}`);
        }else{
            console.log(`${j}: ${output} != ${testVector[j]} - **** FAILED ****`);
            process.exit(0);
        }
    }

    console.log('Success')
})




