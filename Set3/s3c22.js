// //////////////////////////////////////////////////
// Matasano Challenges (while learning Node.js)
// S2C22: Crack a MT19937 seed.
/////////////////////////////////////////////////////
const { seed_mt, extract_number } = require("../utility/mt19937")

function sleep(ms){
    return new Promise( resolve => setTimeout(resolve,ms ));
}

async function setupTest(){
    var sleeptime1 = Math.floor( Math.random() * 1000 * 500 );
    var sleeptime2 = Math.floor( Math.random() * 1000 * 500 );
    console.log(`Configuring Challenge, wait: ${(sleeptime1 + sleeptime2)/1000}s`);
    await sleep( sleeptime1 );

    var seed = Math.floor( new Date().getTime() / 1000 );
    console.log(`Configurting Generator with: ${seed}  (Ssssshhh it's a secret.)`);
    seed_mt( seed )
    await sleep( sleeptime2 );
    var firstNumber = extract_number();
    console.log(`Seeded with unix epoch timestamp, first number of sequence is: ${firstNumber}`);
    return firstNumber;
}

function crackMT19937Seed( startTime, endTime, knownValue, count=1 ){
    for( var i=startTime; i<=endTime; i++ ){
        seed_mt( i );
        for( var j=0; j<count; j++ ){
            var value = extract_number();
            if( value == knownValue ){
                console.log(`Detected probable seed value of: ${i}`)
                return i;
            }
        }
    }
}

setupTest()
    .then( (firstNumber) => {
        console.log('----------------------')
        console.log(`Beginning seed search.`)
        var endTime = ( Math.floor( new Date().getTime() / 1000 ) );
        var startTime = endTime - 10000;
        var guess = crackMT19937Seed( startTime, endTime, firstNumber, 1 );
        var searchTime = ( Math.floor( new Date().getTime() / 1000 ) ) - endTime;
        console.log(`Search completed in: ${searchTime}s`)
        return guess;
    })
