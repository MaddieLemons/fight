const fs = require('fs');
const inquirer = require('inquirer');
const { idText } = require('typescript');
const { hitEnter } = require('./utils');

const LIST_TEAMS = "List all characters by team."
const GET_CHARACTER_WL = "Get a character's W/L record."
const GET_TEAM_WL = "Get a team's W/L record."
const COMPARE_CHARACTERS = "Compare two characters' records fighting each other."
const COMPARE_TEAMS = "Compare two teams' tournament histories."
const ERASE_DATA = "Erase ALL data for ALL characters"
const UPDATE_STATS = "Update character(s)' stats"
const QUIT = "Quit";
const OPTIONS = [LIST_TEAMS, GET_CHARACTER_WL, GET_TEAM_WL, COMPARE_CHARACTERS, COMPARE_TEAMS, ERASE_DATA, UPDATE_STATS, QUIT];

async function inquireList(message, choices){
    /** get user input on which operation to do */

    return await inquirer.prompt([{
        type: 'list',
        name: 'operation',
        message: message,
        choices: choices
    }]).then(answers => {
        return answers["operation"];
    }).catch(e => {
        console.error(e);
    })
}

async function getCharacterData(){
    const data = await fs.promises.readFile('characters/characters.json', 'utf8');
    return JSON.parse(data);
};

async function analyzeData(){
    /** main loop for program */

    const options = {};
    options[LIST_TEAMS] = listTeams;
    options[GET_CHARACTER_WL] = getCharacterWL;
    options[GET_TEAM_WL] = getTeamWL;
    options[COMPARE_CHARACTERS] = compareCharacters;
    options[COMPARE_TEAMS] = compareTeams;
    options[ERASE_DATA] = eraseData;
    options[UPDATE_STATS] = updateStats;

    while(true){
        console.clear();
        const data = await getCharacterData();
        const option = await inquireList("What would you like to do?", OPTIONS);
        if(option === QUIT){
            return;
        }
        await options[option](data);
    }
}

async function listTeams(data){
    const teams = {};
    data.characters.forEach(char => {
        if(!teams[char.team]){
            teams[char.team] = [];
        }
        teams[char.team].push(char.name);
    });
    const teamsKeys = Object.keys(teams);
    for(key of teamsKeys){
        console.log(` ========= ${key.toUpperCase()} =========`);
        for(character of teams[key]){
            console.log(`\t ${character.toUpperCase()}`)
        }
        await hitEnter();
    }
    return;
}

async function getCharacterWL(data){
    const characterName = await inquireList("Which character?", data.ids);
    const character = data.characters.find(el => el.name === characterName);
    if(!character){
        console.log("error: character not found");
        return
    }

    const wins = {};
    const losses = {};

    character.WLRecord.wins.forEach(win => {
        if(!wins[win]){
            wins[win] = 1;
        } else {
            wins[win] += 1;
        }
    })

    character.WLRecord.losses.forEach(loss => {
        if(!losses[loss]){
            losses[loss] = 1;
        } else {
            losses[loss] += 1;
        }
    })

    console.log("========== WINS ==========")
    Object.keys(wins).forEach(key => {
        console.log(`\t ${key}: ${wins[key]}`)
    })
    
    console.log("========== LOSSES ==========")
    Object.keys(losses).forEach(key => {
        console.log(`\t ${key}: ${losses[key]}`)
    })
    const winrate = Number((character.WLRecord.wins.length / 
        (character.WLRecord.wins.length + character.WLRecord.losses.length)).toFixed(3));
    console.log(`\n Overall, ${characterName} has a W/L rate of ${winrate}.`);

    await hitEnter();
    return;
}

async function getTeamWL(data){
    const teamName = await inquireList("Which team?", ["lauren", "fieuline", "jj", "nicole"]); // TODO: get this in json
    const team = data.characters.filter(character => character.team === teamName);
    const WL = team.reduce((acc, curr) => {
        acc.wins += curr.WLRecord.wins.length;
        acc.losses += curr.WLRecord.losses.length;
        return acc;
    }, {wins: 0, losses: 0});
    console.log(`\t WINS: ${WL.wins}`);
    console.log(`\t LOSSES: ${WL.losses}`);
    const winrate = Number((WL.wins /(WL.losses + WL.wins)).toFixed(3));
    console.log(`\n Overall, team "${teamName}" has a W/L rate of ${winrate}.`);
    await hitEnter();
}

async function compareCharacters(data){
    return
}

async function compareTeams(data){
    return;
}

async function updateStats(data){
    return;
}

async function eraseData(data){
    return;
}

module.exports = analyzeData;