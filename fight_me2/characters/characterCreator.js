const inquirer = require("inquirer");
const fs = require('fs');
const { hitEnter, genRandom } = require('../utils');

async function characterCreator(){
    console.clear();

    const stats = {}
    const attributes = ["aro", "hum", "str", "dex"];
    
    console.log(`# # # STATS # # #\n`)
    for(col of attributes){
        stats[col] = genRandom(6, 18);
        console.log(`${col}: ${stats[col]}\n`)
    }

    const data = await getCharacterData()
    data.stats = stats;
    await buildCharacter(data);
}

async function getCharacterData() {
    return await inquirer.prompt([
        { 
            name: "name", 
            message: "What is the character's name?",
        },
        { 
            type: 'list',
            name: "team", 
            message: "Pick a team:",
            choices: ["Fieuline", "JJ", "Nicole", "Lauren"]
        },
        {
            type: "list",
            name: "gender",
            message: "What is your character's gender?",
            choices: ["male", "female", "nonbinary"]
        },
        {
            type: "text",
            name: "species",
            message: "What is your character's species?"
        }
    ]).then(answers => {
        const keys = Object.keys(answers);
        keys.forEach(key => {
            answers[key] = answers[key].toLowerCase()
        })
        return answers;
    })
}

async function buildCharacter(data){

    // Prep Data
    data.WLRecord = {wins: [], losses: []}

    // Read JSON
    const fh = await fs.promises.open('characters/characters.json', "a+") // Creates JSON if doesn't exist
    let characters = await fh.readFile('utf8');
    fh.close()
    if(!characters){
        characters = {"characters": [], "ids": []}
    } else {
        characters = JSON.parse(characters)
    }

    // Write JSON
    if(characters["ids"].includes(data.name)){
        console.log("A character with that name already exists.");
        await hitEnter();
    } else {

        const attributes = ["aro", "str"];
        console.clear();

        data.finishers = {}; 

        for(col of attributes){
            await inquirer.prompt([
                {
                    name: "finisher",
                    message: `Describe the ${col} finisher. use #E for enemy name, #E.sub, #E.obj, #E.poss for pronouns.\n`
                }
            ]).then(answers => {
                data.finishers[col] = answers["finisher"];
            })
        }

        characters["characters"].push(data);
        characters["ids"].push(data.name);
        data = JSON.stringify(characters);
        await fs.promises.writeFile('characters/characters.json', data);
    }
}

module.exports.characterCreator = characterCreator;