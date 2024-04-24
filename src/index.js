require('dotenv').config();
const { Client, IntentsBitField, Component } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('connected to DB');

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
