class Character {
	constructor(name, constitution, power, poise, intimidation, charisma) {
		this.name = name;
		this.constitution = constitution; // Represents Health
		this.power = power;               // Attack strength
		this.poise = poise;               // Ability to stay calm under pressure (defense against charisma attacks)
		this.intimidation = intimidation; // Ability to lower enemy's poise
		this.charisma = charisma;         // Ability to fluster enemies, perhaps making them miss or take wrong decisions
	}

	// Simulate a D20 roll
	rollDice(sides) {
		return Math.floor(Math.random() * sides) + 1;
	}

	attack(target) {
		let roll = this.rollDice(20); // For D20
		let damage = 0;

		if (roll === 20 || (roll + this.power >= target.constitution)) {
			damage = (roll === 20) ? this.rollDice(6) + this.rollDice(6) : this.rollDice(6); // For D6

			target.hp -= damage;
			console.log(`${this.name} attacked ${target.name} for ${damage} damage!`);

			if (target.hp <= 0) {
				console.log(`${target.name} has been defeated!`);
			}
		} else {
			console.log(`${this.name}'s attack missed ${target.name}!`);
		}
	}

	intimidate(target) {
		let intimidationValue = this.intimidation + this.rollD20() - target.charisma;
		if (intimidationValue > 0) {
			target.poise -= intimidationValue;
			if (target.poise < 0) target.poise = 0;
			console.log(`${this.name} intimidated ${target.name}, reducing their poise by ${intimidationValue}!`);
		} else {
			console.log(`${this.name}'s intimidation had no effect on ${target.name}!`);
		}
	}

	displayStats() {
		console.log(`Name: ${this.name}`);
		console.log(`Constitution: ${this.constitution}`);
		console.log(`Power: ${this.power}`);
		console.log(`Poise: ${this.poise}`);
		console.log(`Intimidation: ${this.intimidation}`);
		console.log(`Charisma: ${this.charisma}`);
	}
}

// Usage
const player1 = new Character("John", 100, 15, 12, 10, 14);
const player2 = new Character("Doe", 90, 14, 13, 11, 15);

player1.displayStats();
player2.displayStats();

player1.attack(player2);
player2.intimidate(player1);

player1.displayStats();
player2.displayStats();
