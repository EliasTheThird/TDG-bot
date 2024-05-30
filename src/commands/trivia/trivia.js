const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const triviaQuestions = require('../../database/trivia-database');

let currentQuestion = null;
let currentWinner = null;
const roleId = '1161113839883010089'; // The ID of the role to be given to the winner
const channelId = '1095238175187816449'; // The ID of the channel to post trivia questions in
let triviaLoopRunning = false;

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const channel = client.channels.cache.get(channelId);

    if (!channel) {
      await interaction.reply({
        content: 'Trivia channel not found!',
        ephemeral: true,
      });
      return;
    }

    if (triviaLoopRunning) {
      await interaction.reply({
        content: 'Trivia game is already running!',
        ephemeral: true,
      });
      return;
    }

    triviaLoopRunning = true;
    startTriviaLoop(interaction.guild, channel);

    await interaction.reply({
      content: `Trivia game started in <#${channelId}>!`,
      ephemeral: true,
    });
  },

  name: 'trivia',
  description: 'Start the trivia game loop.',
  devOnly: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.SendMessages],
  options: [],
};

async function startTriviaLoop(guild, channel) {
  while (triviaLoopRunning) {
    const delay = getRandomInt(30000, 60000); // Random delay between 30 and 60 seconds
    await new Promise(resolve => setTimeout(resolve, delay));

    await removePreviousWinnerRole(guild, channel); // Remove the role from the previous winner and notify

    await postTriviaQuestion(channel); // Post a new trivia question

    const filter = response => {
      if (currentQuestion) {
        const { answer } = currentQuestion;
        if (Array.isArray(answer)) {
          return answer.some(a => response.content.toLowerCase() === a.toLowerCase());
        } else {
          return response.content.toLowerCase() === answer.toLowerCase();
        }
      }
      return false;
    };

    try {
      const collected = await channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] }); // Wait for 15 seconds for the correct answer
      const winner = collected.first().author;

      currentWinner = winner;

      await assignRoleToWinner(guild, channel); // Assign the role to the new winner and notify

      await channel.send(`Congratulations <@${winner.id}>, you answered correctly and are now the Trivia Winner!`);

      currentQuestion = null; // Reset current question
    } catch (error) {
      await channel.send('No correct answers were given in time. The trivia question is now closed.');
      currentQuestion = null; // Reset current question
    }
  }
}

async function removePreviousWinnerRole(guild, channel) {
  if (currentWinner) {
    const previousWinnerMember = guild.members.cache.get(currentWinner.id);
    if (previousWinnerMember) {
      await previousWinnerMember.roles.remove(roleId).catch(console.error);
      await channel.send('The role should be removed from the previous winner.');
    }
  }
}

async function assignRoleToWinner(guild, channel) {
  if (currentWinner) {
    const winnerMember = guild.members.cache.get(currentWinner.id);
    if (winnerMember) {
      await winnerMember.roles.add(roleId).catch(console.error);
      await channel.send('The role should be added to the winner.');
    }
  }
}

async function postTriviaQuestion(channel) {
  currentQuestion = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
  await channel.send(`${currentQuestion.question}`);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
