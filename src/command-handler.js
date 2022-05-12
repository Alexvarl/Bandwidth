const Discord = require('discord.js');
const verifyHandler = require('./commands/verify').handler;
const toggleroleHandler = require('./commands/togglerole').handler;

const commands = {
	verify: verifyHandler,
	togglerole: toggleroleHandler,
};

/**
 * 
 * @param {Discord.Interaction} interaction
 */
async function commandHandler(interaction) {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	// do nothing if no command
	if (!commands[commandName]) {
		interaction.reply(`Missing command handler for \`${commandName}\``);
		return;
	}

	// run the command
	commands[commandName](interaction);
}

module.exports = commandHandler;