const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
} = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    // Get description from options
    const description = interaction.options.getString('description');

    // Set cooldown key
    const cooldownKey = `${interaction.user.id}-revive`;
    const cooldown = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Check if cooldown is still in effect
    if (
      client.cooldowns.has(cooldownKey) &&
      Date.now() - client.cooldowns.get(cooldownKey) < cooldown
    ) {
      await interaction.reply({
        content: 'This command is on cooldown. Please wait.',
        ephemeral: true,
      });
      return;
    }

    // Set new cooldown time
    client.cooldowns.set(cooldownKey, Date.now());

    // Reply with the message
    await interaction.reply(
      `Revive action performed with description: ${description}`
    );
  },
    deleted: true,
  name: 'revive',
  description: 'Revives a user or system with a given description!',
  devOnly: false,
  options: [
    {
      name: 'description',
      description: 'Description of the revive.',
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [], // Assuming no special Discord permissions are required
  botPermissions: [], // Assuming no special bot permissions are required
};
