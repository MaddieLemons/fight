const inquirer = require('inquirer');

function genRandom(min, max) {
    const num = Math.floor(Math.random() * (max+1-min) + min)
    return num;
}

async function hitEnter() {
    await inquirer.prompt([
        {
            name: "hit-enter",
            message: 'press enter to continue'
        }
    ]).then(_ => {
        return null;
    })
}


function printState(p1, p2){
    const domRatings = {
        0: "Standard",
        1: "Dominant",
        2: "Masterful"
    }
    console.log("====================================");
    console.log(`\n ${p1.name.toUpperCase()}\n`)
    console.log(`HP: ${p1.health.value}`);
    const p1Dominance = domRatings[p1.health.level];
    console.log(`Dominance: ${p1Dominance}\n`)
    console.log("====================================\n\n");
    console.log("====================================");
    console.log(`\n ${p2.name.toUpperCase()}\n`)
    console.log(`HP: ${p2.health.value}`);
    const p2Dominance = domRatings[p2.health.level];
    console.log(`Dominance: ${p2Dominance}\n`)
    console.log("====================================");
}

module.exports = {
    genRandom,
    hitEnter,
    printState
}
