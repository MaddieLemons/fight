const inquirer = require("inquirer");
const { characterCreator } = require("./characters/characterCreator");
const gameMenu = require('./fight_me').gameMenu;
const analyzeData = require('./analyzeData');

const CREATE = "Create a Character";
const DATA = "View Data";
const GAME = "Play the Game";
const QUIT = "quit";

async function promptUser(){

    return await inquirer.prompt([{
        type: "list",
        name: "game-mode",
        message: "What would you like to do? Enter a number.",
        choices: [CREATE, DATA, GAME, QUIT]
    }]).then(answers =>{
       return answers["game-mode"];
    }).catch(e => {
        console.error(e);
    })
}

async function getGameMode(){
    // console.clear()
    let res;
        try {
            res = await promptUser();
        } catch (e) {
            console.error(e)
        }   
    return res
}

async function gameRouter(){
    while(true){
        console.clear()
        const gameMode = await getGameMode();
        if(gameMode === CREATE){
            await characterCreator();
        } else if(gameMode === GAME) {
            console.clear()
            await gameMenu()
        } else if(gameMode === DATA) {
            await analyzeData();
        }else {
            return 0;
        }
    }   
}

gameRouter();