const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);
    const issuer = interaction.member; // `member` is the guild member who executed the command

    if (!member) {
      await interaction.reply({
        content: "This user doesn't exist in the server.",
        ephemeral: true,
      });
      return;
    }

    // ID of Blacklisted Role
    const protectedRoleId = '1143968250452000788';
    // Check if the member has the protected role
    if (member.roles.cache.has(protectedRoleId)) {
      await interaction.reply({
        content: 'This user is protected from being warned, L',
      });
      return;
    }

    if (member.id === interaction.guild.ownerId) {
      await interaction.reply("You can't ban Dario silly.");
      return;
    }

    if (member.roles.highest.position >= issuer.roles.highest.position) {
      await interaction.reply({
        content: 'You cannot warn Dario silly.',
      });
      return;
    }
    // Comparing role positions
    if (member.roles.highest.position >= issuer.roles.highest.position) {
      await interaction.reply({
        content: 'You cannot warn someone with an equal or higher role.',
      });
      return;
    }
    const reason =
      interaction.options.getString('reason') ||
      'Your activities have been noted and require moderation.';

    const embed = new EmbedBuilder()
      .setTitle('Warning Notice')
      .setDescription('You have been warned!')
      .setColor('Random')
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {
          name: 'Username',
          value: user.username,
          inline: true,
        },
        {
          name: 'User ID',
          value: user.id,
          inline: true,
        },
        {
          name: 'Note',
          value: reason,
          inline: false,
        }
      );

    await interaction.reply({
      content: `📢 Hey, <@${user.id}>, you have been warned! 🤡`,
      embeds: [embed],
      allowedMentions: { parse: ['users'] },
    });
  },

  name: 'warn',
  description: 'Warn another user!!!',
  options: [
    {
      name: 'user',
      description: 'Select a user',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for warning the user',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
};
