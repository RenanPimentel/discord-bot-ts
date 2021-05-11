import { Client } from 'discord.js';
import connectDB from './config/db';
import commands from './commands';
import environment from './config/endpoints.config';

const {
  createCommand,
  removeCommand,
  sendHelpMessage,
  updateCommand,
  sendCommand,
  defaultCommands,
} = commands;

const client = new Client();
const prefix = environment.prefix || '!';
client.once('ready', () => {
  if (!client.user) return;
  console.log(`${client.user.username} online`);
  connectDB();

  const activities = defaultCommands.map((cmd) => `${prefix}${cmd}`);

  setInterval(() => {
    if (client.user)
      client.user.setActivity({
        name: activities.getRandom(),
        type: 'PLAYING',
      });
  }, 1000 * 60);
});

client.on('message', async (msg) => {
  if (msg.author.bot || !msg.guild) return;
  if (msg.channel.type !== 'text') return;
  if (!msg.content.startsWith(prefix)) return;

  const [cmdName, ...args] = msg.content.slice(prefix.length).split(' ');
  const guildId = msg.guild.id;

  if (cmdName === 'add') {
    createCommand(msg, args, guildId);
  } else if (cmdName === 'help') {
    sendHelpMessage(msg, guildId);
  } else if (cmdName === 'update') {
    updateCommand(msg, args, guildId);
  } else if (cmdName === 'remove') {
    removeCommand(msg, args, guildId);
  } else {
    sendCommand(msg, cmdName, guildId);
  }
});

client.login(environment.botToken);
