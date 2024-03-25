const {genRandom, hitEnter, printState} = require('../utils');

async function basicAttack(self, enemy, count){
    const basicAttacks = [
        {
            text: `${self.name} subverts ${enemy.name}'s self-confidence with a blistering insult`,
            type: "humiliation",
            value: 15
        },
        {
            text: `${self.name} utterly destroys ${enemy.name} in a game of best-at-seduction.`,
            type: 'sexual',
            value: 15
        },
        {
            text: `${self.name} clamps ${enemy.name}'s head between ${self.pronouns.poss} thighs and squeezes.`,
            type: 'physical',
            value: 15
        },
        {
            text: `${self.name} knees ${enemy.name} in the gut!`,
            type: "physical",
            value: 10
        },
        {
            text: `${self.name} sabotages ${enemy.name}'s date with baby pictures and porn history`,
            type: "humiliation",
            value: 10
        },
        {
            text: `${self.name} stuffs ${enemy.name}'s mouth full of aphrodisiac sprouts!`,
            type: "sexual",
            value: 10
        },
        {
            text: `${self.name} intellectually, physically, and socially dominates ${enemy.name} so thoroughly, that ${enemy.pronouns.sub} enters masochistic euphoria.`,
            type: "sexual",
            value: 20
        },
        {
            text: `${self.name} stomps on ${enemy.name}'s groin!`,
            type: 'physical',
            value: 20
        },
        {
            text: `${self.name} shoves ${enemy.name}'s face into a toilet and grinds the loser's scalp with ${self.pronouns.poss} heel.`,
            type: 'humiliation',
            value: 20
        }
    ]

    const finalAttackIndex = basicAttacks.length - 1
    const attack = basicAttacks[genRandom(0, finalAttackIndex)]
    enemy.health.value -= attack.value;
    console.clear()
    console.log(`\n${attack.text} \n`);
    if(count % 2 === 0)
        printState(enemy, self);
    else
        printState(self, enemy)
    await hitEnter();
    return false;
}

// const lauren = {
//     name: 'lauren',
//     pronouns: {
//         sub: 'she',
//         poss: 'her'
//     },
//     health: 100,
//     confidence: 100,
//     arousal: 0
// }

// const chris = {
//     name: 'chris',
//     pronouns: {
//         sub: 'he',
//         poss: 'him'
//     },
//     health: 100,
//     confidence: 100,
//     arousal: 0
// }

// async function runGame(){
//     let x;
//     while(!x){
//         let num = genRandom(0,1);
//         let p1 = num ? lauren : chris;
//         let p2 = num ? chris : lauren;
//         await basicAttack(p1,p2);
//         console.log('LAUREN', lauren);
//         console.log('CHRIS', chris);
//         await hitEnter();
//         if(p2.health <= 0 || p2.confidence <= 0 || p2.arousal >= 100){
//             console.log(`${p1.name} wins!`)
//             x = true;
//         }
//     }
// }

module.exports = basicAttack;
