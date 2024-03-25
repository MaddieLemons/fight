const Player = require('../characters/Player').Player;
const genRandom = require('../utils').genRandom;
const fs = require('fs');

const players = ["str", "dex", "aro", "hum"].map(stat => {
    const profile = {
        stats: {
            "str": 8,
            "dex": 8,
            "aro": 8,
            "hum": 8,
        },

        "name": `${stat}-player`
    };

    profile.stats[stat] = 18;

    return profile;
});

const [strPlayer, dexPlayer, aroPlayer, humPlayer] = players;

async function testFight(p1, p2){

    // Assign atkType
    // For now, this is just whatever the highest
    // stat is.
    const atkTypes = Object.keys(p1.stats);
    [p1, p2].forEach(player => {
        player.atkType = atkTypes.reduce((acc, curr) => {
            acc = player.stats[curr] > player.stats[acc] ? curr : acc;
            return acc;
        });
    })

    // Randomly assign the first attacker
    let toggle = genRandom(0, 1);
    let attacker;
    let defender;
    attacker = toggle % 2 ? p1 : p2;
    defender = toggle % 2 ? p2 : p1;
    
    attacker.data = { misses: 0, hits: 0, name: attacker.name }
    defender.data = { misses: 0, hits: 0, name: defender.name }

    let count = 1;
    let isDead = await attacker.attack(defender, true, attacker.atkType, attacker.data);
    toggle = await defender.resolveStatus(toggle, true);
    while(true){
        count++;
        attacker = toggle%2 ? p1 : p2;
        defender = toggle%2 ? p2 : p1;
        isDead = await attacker.attack(defender, true, attacker.atkType, attacker.data);
        if(isDead){
            return {
                winner: {...attacker.data},
                loser: {...defender.data},
                duration: count
            }
        }
        toggle = await defender.resolveStatus(toggle, true);
        toggle = toggle ? 0 : 1;
        if(attacker.atkType === "aro" && defender.arousal === 5){
            attacker.atkType = "hum";
        } else if(attacker.atkType === "hum" && defender.humiliation === 5){
            attacker.atkType = "aro";
        }

    }
}

async function saveData(iters = 1000, stats1, stats2){
    let payload = [];
    for(let i = 0; i< iters; i++){
        const p1 = new Player(stats1.name, "female", stats1.stats);
        const p2 = new Player(stats2.name, "female", stats2.stats);
        const result = await testFight(p1, p2)
        payload.push(result);
    }
    payload = JSON.stringify(payload);
    const fh = await fs.promises.open('./gameStats.json', 'w+');
    await fh.writeFile(payload);
    fh.close();
}


saveData(1000, aroPlayer, dexPlayer);