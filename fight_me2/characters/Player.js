const inquirer = require('inquirer');
const { genRandom, hitEnter } = require('../utils');
const fs = require('fs');

const pronounsDict = {
    "male": {
        sub: 'he',
        poss: 'his',
        obj: 'him'
    }, 
    "female": {
        sub: 'she',
        poss: 'her',
        obj: 'her'
    },
    "nonbinary": {
        sub: 'they',
        poss: 'their',
        obj: 'them'
    }
}

class Player {
    constructor(name, gender, stats, finishers, WLRecord, species){
        this.name = name;
        this.pronouns = pronounsDict[gender]
        this.health = 100;
        this.stun = false;
        this.arousal = 0;
        this.humiliation = 0;
        this.stats = stats;
        this.finishers = finishers;
        this.WLRecord = WLRecord;
        this.species = species
    }

    async saveWL(){
        const fhr = await fs.promises.open('characters/characters.json', "r") // Creates JSON if doesn't exist
        const data = JSON.parse(await fhr.readFile("utf8"));
        await fhr.close();
        const self = data.characters.filter(e => e.name === this.name)[0];
        self.WLRecord = this.WLRecord;
        console.log(data)
        for(let character of data.characters){
            if(character.name === self.name){
                character.WLRecord = this.WLRecord
            }
        }
        const fhw = await fs.promises.open('characters/characters.json', "w") // Creates JSON if doesn't exist
        await fhw.writeFile(JSON.stringify(data))
        await fhw.close();
    }
   
    async printFinisher(type, target){
        const regE = /#E/g;
        const regSub = /#E\.sub/g;
        const regPoss = /#E\.poss/g;
        const regObj = /#E\.obj/g;
        const regSpec = /#E\.spec/g;
        const newline = /\\n/g;
        const finisher_start = this.finishers[type];
        const finisher_2 = finisher_start.replace(regObj, target.pronouns.obj);
        const finisher_3 = finisher_2.replace(regSub, target.pronouns.sub);
        const finisher_4 = finisher_3.replace(regPoss, target.pronouns.poss);
        const finisher_5 = finisher_4.replace(regSpec, target.species);
        const finisher_6 = finisher_5.replace(regE, target.name);
        const finisher_7 = finisher_6.replace(newline, "\n");
        console.clear();
        console.log(finisher_7 + "\n")
    }

    async attack(target, test = false, atkType=null, testDict = { misses: 0, hits: 0}){

        /* DESCRIPTION: main function for the attack loop.
            if testFlag is true, then the attack loop will avoid
            all logging
        */

        const resultText = []

        if(!test){
            atkType = await this.getAttack();
        } 


        const [outcome, natRoll] = await this.contest(target, atkType, resultText);

        if(outcome){
            await target.takeLoss(atkType, this, resultText, natRoll)
            testDict.hits += 1
        } else {
            const outcomeDict = {
                "dex": `${target.name} dodges ${this.name}'s attempt at a precise strike`,
                "str": `${target.name} slips under a clumsy blow.`,
                "hum": `${target.name} rolls her eyes as ${this.name} fumbles an insult`,
                "aro": `${target.name} is unimpressed by ${this.name}'s attempt at seduction`
            }
            resultText.push(outcomeDict[atkType])
            testDict.misses += 1;
        }

        target.resolveStatus(resultText);

        const resultDict = {
            "aro": "aro",
            "hum": "aro",
            "str": "str",
            "dex": "str"
        }

        return [target.isDead(), resultDict[atkType]];
    }

    async getAttack(){
        while(true){
            const type = await inquirer.prompt([{
                type: 'list',
                name: "type",
                message: `${this.name}:Pick an attack. Dex, str, aro, hum.\n`,
                choices: ["Dex", "Aro", "Str", "Hum", "Show My Stats"]
            }]).then(answers => {
                return answers.type.toLowerCase()
            })

            if(type === "show my stats"){
                console.clear();
                console.log(`=== ${this.name.toUpperCase()} ===\n`);
                const stats = Object.keys(this.stats);
                stats.forEach(stat => {
                    console.log(`# ${stat.toUpperCase()}: ${this.stats[stat]}\n`)
                })
                console.log(`HUMILIATION: ${this.humiliation}\n`);
                console.log(`AROUSAL: ${this.arousal}\n`)
                await hitEnter()
            } else {
                return type;
            }
        }
    }

    async contest(target, type, resultText){
        /* DESCRIPTION: Accepts a player target and an attack type and rolls weighted dice.
            Returns myRoll >= tarRoll
        */

        const defenseType = this.getDefenseType(type);
        const mods = await this.getModifiers(target);
        const natRoll = genRandom(1, 20);
        const myRoll = genRandom(1, 20) + mods.atk[type];
        resultText.push(`${this.name} rolled a ${myRoll} with a ${mods.atk[type]} modifier.`)
        const tarRoll = genRandom(1, 20) + mods.def[defenseType];
        resultText.push(`${target.name} rolled a ${tarRoll} with a ${mods.def[type]} modifier.`)


        // Dex is more likely to hit than Str on balance
        if(type == "str"){
            return [myRoll > tarRoll + 1, natRoll];
        } else if(type == "dex") {
            return [myRoll >= tarRoll - 1, natRoll];
        }
        return [myRoll >= tarRoll, natRoll];
    }

    getDefenseType(type){
        if(type === "hum" || type === "aro"){
            return type;
        } else {
            const str = this.stats["str"];
            const dex = this.stats["dex"];
            if(this.humiliation >= 3){
                return str > dex ? "dex" : "str";
            } else {
                return str > dex? "str" : "dex";
            }
        }
    }
    
    async takeLoss(type, attacker, resultText, natRoll){

        let crit = 0
        if(natRoll === 20 || (natRoll === 19 && (type === "dex" || type === "hum"))){
            crit = 1;
            resultText.push("Critical hit!")
        }

        if(type === "str"){
            this.health -= (genRandom(5, 30) + (crit * 3) + 5); // Add in text here?
            const stunned = genRandom(1, 10) == 10 ? true : false;
            resultText.push(`${attacker.name} bludgeons ${this.name} with a powerful blow!`)
            if(stunned){
                resultText.push(`${this.name} is stunned by a powerful attack!`)
                this.stun = true;
            }
        } else if(type === "dex"){
            resultText.push(`${attacker.name} cuts ${this.name} with a precise slice!`)
            this.health -= genRandom(5, 30) * (crit + crit > 0 ? 2 : 1);
            if(crit){
                resultText.push(`${attacker.name} finds ${this.name}'s weakpoint and stuns with a crippling low blo!`);
                this.stun = true;
            }
        } else if(type === "hum"){
            resultText.push(`${attacker.name} humiliates ${this.name} in public!`)
            if(genRandom(0, 4) * this.humiliation > 4){
                resultText.push(`${this.name} is so humiliated that ${attacker.name} finds they can better control their libido`);
                attacker.arousal -= 2;
                attacker.arousal = attacker.arousal < 0 ? 0 : attacker.arousal;
                this.arousal += 1
                this.arousal = this.arousal > 5 ? 5 : this.arousal
            }
            if(this.humiliation < 5)
                this.humiliation = this.humiliation + 1 + (crit) > 5 ? 5 : this.humiliation + 1 + (crit)
            if(crit){
                this.arousal = this.arousal < 4 ? this.arousal + genRandom(1, 2) : 4
                resultText.push(`${attacker.name} humiliates ${this.name} so deeply that it turns them on.`)
            }
        } else {
            resultText.push(`${attacker.name} attracts ${this.name} with their sexy allure!`)
            if(this.arousal < 5)
                this.arousal = this.arousal + 1 + (crit) > 5 ? 5 : this.arousal + 1 + (crit)
        }
    }


    async printResult(resultArr){

        if(resultArr.length > 0){
        console.clear();
        for(const result in resultArr){
            console.log(resultArr[result]);
        }
        await hitEnter();

        }

    }

    async getModifiers(target){
        const mods = {atk: {"str": 0, "dex": 0, "aro": 0, "hum": 0}, def: {"str": 0, "dex": 0, "aro": 0, "hum": 0}};
        
        ["str", "dex", "aro", "hum"].forEach(stat => {
            mods.atk[stat] = Math.ceil((this.stats[stat] - 10) / 2);
            mods.def[stat] = Math.ceil((target.stats[stat] - 10) / 2);
        });

        const stats = ["str", "dex", "aro", "hum"];

        // Humiliation affects attacker and defender in the same way
        const humiliationDict = {
            0: 0,
            1: -2,
            2: -3,
            3: -4,
            4: -5,
            5: -10
        }

        const aroDict = {
            0:0,
            1:0,
            2:0,
            3:0,
            4:-2,
            5:-3
        }

        stats.forEach(stat => {
            mods.atk[stat] += humiliationDict[this.humiliation];
            mods.atk[stat] += aroDict[this.arousal];
            mods.def[stat] += humiliationDict[target.humiliation];
            mods.def[stat] += aroDict[target.arousal];
        })

        // Bonus of penalty for pursuing BOTH aro and hum

        const targetStat = target.humiliation > target.arousal ? "arousal" : "humiliation"
        mods.def["dex"] += Math.ceil(humiliationDict[target[targetStat]]);
        mods.def["str"] += Math.ceil(humiliationDict[target[targetStat]]);
        mods.def["aro"] += Math.ceil(humiliationDict[target[targetStat]]);
        mods.def["hum"] += Math.ceil(humiliationDict[target[targetStat]]);

        return mods;
    }

    
    async resolveStatus(resultText=[], test=false){

        this.resolveAro(resultText)

        if(this.arousal){
            const startArousal = this.arousal;
            if(this.arousal === 5){
                this.arousal -= genRandom(1, 20) === 20 ? 1 : 0
            } else if(this.arousal < 4 && this.arousal > 1){
                this.arousal -= genRandom(1, 10) > 7 ? 1 : 0
            } else {
                this.arousal -= genRandom(1, 20) > 15 ? 1 : 0
            }
            if(startArousal > this.arousal){
                resultText.push(`${this.name} calms some of their arousal`)
            }
        }

        if(this.humiliation){
            const startHumiliation = this.humiliation;
            if(this.humiliation === 5){
                this.humiliation -= genRandom(1, 20) === 20 ? 1 : 0
            } else if(this.humiliation < 4 && this.humiliation > 1){
                this.humiliation -= genRandom(1, 10) > 8 ? 1 : 0
            } else {
                this.humiliation -= genRandom(1, 20) > 15 ? 1 : 0
            }
            if(startHumiliation > this.humiliation){
                resultText.push(`${this.name} calms some of their humiliation`)
            }
        }

        if(!test)
            await this.printResult(resultText);
    }

    async resolveAro(resultText){
        const aroDict = {
            0: 100,
            1: 90,
            2: 80,
            3: 70,
            4: 70,
            5: 30
        }

        const stunned = genRandom(1, 100) > aroDict[this.arousal] ? true : false;
        if(stunned){
            this.arousalCount = 1
            resultText.push(`${this.name} is too aroused to fight!`);
            if(this.arousalCount){
                this.arousalCount += 1
                resultText.push(`${this.name} succumbs and lets their rival 'punish' them.`)
                this.health -= genRandom(5, 30) * this.arousalCount;
            }
            this.stun = stunned;
        }
    }

    unstun(){
        this.stun = false;
    }



    isDead(){
        return this.health <= 0 || (this.humiliation === 5 && this.arousal === 5);
    }
}



module.exports = {
    Player
}