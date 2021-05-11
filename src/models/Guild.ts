import { User } from 'discord.js';
import mongoose from 'mongoose';

export interface CommandProtocol {
  input: string;
  output: string;
  author: User;
}

export interface GuildProtocol {
  id: string;
  commands: CommandProtocol[];
  timeStamp: Date;
}

const guild = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  commands: {
    type: Array,
    default: [],
  },
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
});

export const Guild = mongoose.model('Guild', guild);
