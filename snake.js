const hitEnter = require('../utils').hitEnter;
const Player= require('./classes').Player;
const MoveList = require('./classes').MoveList;

const deadlyKiss = {
    prelim(enemy, self){
        console.log(`${self.name} embraces ${enemy.name}! ${enemy.name} trembles as ${self.name} slides her tongue into her mouth.`);
    },
    success(enemy, self){
        console.log(`Hot venom slips between ${enemy.name}'s lips--${enemy.name} falls to her knees, clutching her throat!`);
        return false;
    },
    fail(enemy, self){
        console.log(`${enemy.name} bites down on {self.name}'s tongue, who flails and--after a struggle--tears away, whimpering.`)
        return false;
    }
}

const constrict = {
    prelim(enemy, self){
        console.log(`Struggling but to no avail, ${enemy.name} gasps as ${self.name} loops a figure 8 around her thighs, tearing her legs forcefully apart.`)
    },

    success(enemy, self){
        console.log(`A sultry smile on her lips, ${self.name} suckles her index finger, coating it in venom--and inserts it deep into ${enemy.name}'s throbbing snatch!`);
        console.log(`${enemy.name}'s back arches as she chokes on a grunt of pleasure.`);
        return false;
    },

    fail(enemy, self){
        console.log(`${enemy.name} flails and bites and claws--and finally manages to escape.`)
        return false;
    }
}

const choke = {
    prelim(enemy, self){
        console.log(`Her prey now putty in her arms, ${self.name} puts ${enemy.name} into a choke hold.`);
        console.log(`${enemy.name} writhes as the oxygen in their brain burns away to nothing. Then, their pupils dilate as they feel ${self.name}'s tail force its way between their legs...`);
    },

    async success(enemy, self){
        console.log(`Fuck...f-fuuuck...`)
        console.log(`Tears stream down ${enemy.name}'s face as she fights with ${self.name}'s grip.`);
        console.log(`${self.name}'s tail thrusts deep into ${enemy.name}`);
        console.log(`FffffuuuUUUUUCK! FUCK F-F...nnn...`);
        console.log(`Orgasm finally takes ${enemy.name}, who goes tight, then limp in ${self.name}'s arms`);
        await hitEnter();
        console.log(`${self.name} rolls ${enemy.name} onto her back. She lays there, prone, gleaming with her own juices.`);
        console.log(`${self.name} steals one last, long, tongue-filled kiss from her conquered opponent, before sliding out of the ring.`)
        console.log(`${self.name} WINS!!`);
        return true;
    },

    fail(enemy, self){
        console.log(`Although ${enemy.name} is weakened, ${self.name} gets too excited too fast. She dives in to bite ${enemy.name}'s throat--and her prey skull-bashes her snout in!`);
        console.log(`${enemy.name} escapes!`)
        return false;
    }
}

const moves = new MoveList(deadlyKiss, constrict, choke);

const snake = new Player('Snake', 'female', moves, false);

module.exports = snake;