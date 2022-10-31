const Discord = require('discord.js');
const database = require('../database');
const { button: acceptButton } = require('../buttons/mod-application-accept');
const { button: denyButton } = require('../buttons/mod-application-deny');

const inServerSince = new Discord.TextInputBuilder();
inServerSince.setCustomId('experience');
inServerSince.setLabel('Do you have prior experience and if so, what?');
inServerSince.setStyle(Discord.TextInputStyle.Short);
inServerSince.setRequired(true);

const timezone = new Discord.TextInputBuilder();
timezone.setCustomId('timezone');
timezone.setLabel('What is your timezone?');
timezone.setStyle(Discord.TextInputStyle.Short);
timezone.setRequired(true);

const availablity = new Discord.TextInputBuilder();
availablity.setCustomId('availablity');
availablity.setLabel('What is your availablity?');
availablity.setStyle(Discord.TextInputStyle.Short);
availablity.setRequired(true);

const why = new Discord.TextInputBuilder();
why.setCustomId('why');
why.setLabel('Why do you want to become a moderator?');
why.setStyle(Discord.TextInputStyle.Short);
why.setRequired(true);

const extra = new Discord.TextInputBuilder();
extra.setCustomId('extra');
extra.setLabel('What else can you tell us about yourself?');
extra.setStyle(Discord.TextInputStyle.Paragraph);
extra.setRequired(true);

const actionRow1 = new Discord.ActionRowBuilder();
actionRow1.addComponents(inServerSince);

const actionRow2 = new Discord.ActionRowBuilder();
actionRow2.addComponents(timezone);

const actionRow3 = new Discord.ActionRowBuilder();
actionRow3.addComponents(availablity);

const actionRow4 = new Discord.ActionRowBuilder();
actionRow4.addComponents(why);

const actionRow5 = new Discord.ActionRowBuilder();
actionRow5.addComponents(extra);

const modApplicationModal = new Discord.ModalBuilder();
modApplicationModal.setCustomId('mod-application');
modApplicationModal.setTitle('Moderator Application');
modApplicationModal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4, actionRow5);

/**
 *
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function modApplicationHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});

	const experience = interaction.fields.getTextInputValue('experience');
	const timezone = interaction.fields.getTextInputValue('timezone');
	const availablity = interaction.fields.getTextInputValue('availablity');
	const why = interaction.fields.getTextInputValue('why');
	const extra = interaction.fields.getTextInputValue('extra');

	const applyingMember = await interaction.member.fetch();
	const guild = await interaction.guild.fetch();

	const channelId = await database.getGuildSetting(interaction.guildId, 'mod_applications_channel_id');
	const channel = channelId && await guild.channels.fetch(channelId);

	if (!channel) {
		throw new Error('application failed to submit - channel not setup!');
	}

	const modApplicationEmbed = new Discord.EmbedBuilder();

	modApplicationEmbed.setColor(0x0096FF);
	modApplicationEmbed.setTitle('Mod Application');
	modApplicationEmbed.setDescription('A user has submitted a moderator application');
	modApplicationEmbed.setImage('attachment://pending-banner.png');
	modApplicationEmbed.setThumbnail('attachment://pending-icon.png');
	modApplicationEmbed.setAuthor({
		name: applyingMember.user.tag,
		iconURL: applyingMember.user.avatarURL()
	});
	modApplicationEmbed.setFields([
		{
			name: 'Do you have prior experience and if so, what?',
			value: experience
		},
		{
			name: 'What is your timezone?',
			value: timezone
		},
		{
			name: 'What is your availablity?',
			value: availablity
		},
		{
			name: 'Why do you want to become a moderator?',
			value: why
		},
		{
			name: 'What else can you tell us about yourself?',
			value: extra
		}
	]);
	modApplicationEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: guild.iconURL()
	});
	modApplicationEmbed.setTimestamp(Date.now());

	const row = new Discord.ActionRowBuilder();
	row.addComponents(acceptButton, denyButton);

	await channel.send({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/pending-icon.png',
			__dirname + '/../images/pending-banner.png',
		]
	});

	await interaction.editReply({
		content: 'Application submitted!',
		ephemeral: true
	});
}

module.exports = {
	name: modApplicationModal.data.custom_id,
	modal: modApplicationModal,
	handler: modApplicationHandler
};