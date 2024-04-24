const { ActivityType } = require('discord.js');

const statuses = [
  {
    name: 'TrainerDario',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=D2Bdj6hDgaA',
  },
  {
    name: 'bot by EliasTheThird',
    type: ActivityType.Playing,
  },
  {
    name: 'Yap',
    type: ActivityType.Listening,
  },
  {
    name: 'The Goat',
    type: ActivityType.Watching,
  },
];

function setStatus(client) {
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[randomIndex];

    const activityOptions = { type: status.type };
    if (status.url) {
      activityOptions.url = status.url;
    }

    client.user.setActivity(status.name, activityOptions);
  }, 30000);
}

module.exports = setStatus;
