const inquirer = require("inquirer");
const { genRandom, hitEnter } = require('./utils');
const fs = require('fs');
const { Player } = require('./characters/Player');

async function selectOption(message, choices) {
    const response = await inquirer.prompt([{
        type: 'list',
        name: 'selection',
        message: message,
        choices: choices
    }]);
    return response.selection;
}

async function gameMenu() {
    const mode = await selectOption('select game mode', ["character vs character", "team vs team"]);

    let choice1, choice2, parameter;

    if (mode === "character vs character") {
        const characters = fs.readdirSync('../public/photos');
        choice1 = await selectOption("Select the first character", characters);
        choice2 = await selectOption("Select the second character", characters.filter(char => char !== choice1));
        parameter = "name";
    } else {
        const teamNames = ["fieuline", "jj", "lauren", "nicole"];
        choice1 = await selectOption("Select team 1", teamNames);
        choice2 = await selectOption("Select team 2", teamNames.filter(e => e !== choice1));
        parameter = "team";
    }

    await prepCharacters(choice1, choice2, parameter);
}


async function prepCharacters(name1, name2, queryAttribute) {
    const data = await fs.promises.readFile('characters/characters.json', 'utf8');
    const characters = JSON.parse(data)["characters"];

    const getFilteredTeam = (name) => characters.filter(p => p[queryAttribute] == name);
    const team1 = getFilteredTeam(name1);
    const team2 = getFilteredTeam(name2);

    let winningTeam = team1, losingTeam = team2;

    const pickPlayer = (team) => {
        return team.length === 1 ? team[0] : team[genRandom(0, team.length - 1)];
    }

    const displayTeam = (team) => {
        console.log(` ##### ${team[0].team} ##### `);
        team.forEach(char => console.log(`\t${char.name}`));
        console.log("\n");
    }

    while (winningTeam.length > 0 && losingTeam.length > 0) {
        const p1data = pickPlayer(winningTeam);
        const p2data = pickPlayer(losingTeam);

        const p1 = new Player(p1data.name, p1data.gender, p1data.stats, p1data.finishers, p1data.WLRecord, p1data.species);
        const p2 = new Player(p2data.name, p2data.gender, p2data.stats, p2data.finishers, p2data.WLRecord, p1data.species);

        const [loser, winner] = await playGame(p1, p2);

        console.clear();
        console.log(`${winner} dominated ${loser} this round!`);

        if (queryAttribute === "team") {
            if (winningTeam.find(char => char.name === loser)) {
                [winningTeam, losingTeam] = [losingTeam, winningTeam];
            }
            losingTeam = losingTeam.filter(char => char.name !== loser);

            displayTeam(winningTeam);
            if (losingTeam.length > 0) {
                displayTeam(losingTeam);
            }

            await hitEnter();
        }
    }
    console.log(`Team ${winningTeam[0].team} has crushed the losers under their heel!`);
}


async function displayStatus(player){
    const aroDict = {
        0: "( •_•)",
        1: "(◉--◉ )",
        2: "(Ꙩ ပꙨ )",
        3: "(≧ ᗜ ≦)",
        4: "(☉ ϖ ☉ )",
        5: "( ≧//∀//≦)♡"
    }

    const humDict = {
        0: "( •_•)",
        1: "⌒ _⌒ ;",
        2: "(>_<)",
        3: ";_;",
        4: "Q_Q",
        5: "(+_+)"
    }

    console.log("###############################################\n");
    console.log(player.name);
    console.log("==========")
    console.log(`HEALTH: ${player.health}`)
    console.log(`AROUSAL: ${aroDict[player.arousal]}`)
    console.log(`HUMILIATION: ${humDict[player.humiliation]}\n`)
    console.log(`${player.stun ? "STUNNED!" : ""}`)
    console.log("###############################################\n");
}


async function playGame(p1, p2) {
    let toggle = genRandom(0, 1);

    while (true) {
        const [attacker, defender] = toggle % 2 ? [p1, p2] : [p2, p1];

        console.clear();
        const [outcome, type] = await attacker.attack(defender);

        if (outcome) {
            console.clear();
            attacker.printFinisher(type, defender);
            await hitEnter();
            attacker.WLRecord.wins.push(defender.name);
            defender.WLRecord.losses.push(attacker.name);
            await Promise.all([attacker.saveWL(), defender.saveWL()]);
            return [defender.name, attacker.name];
        }

        displayStatus(p1);
        displayStatus(p2);
        await hitEnter();

        if (!defender.stun) toggle ^= 1; // Toggle the value between 0 and 1
        defender.unstun();
    }
}


module.exports = { gameMenu }

