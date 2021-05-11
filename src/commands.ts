import { Message } from 'discord.js';
import { GuildCtrl } from './controllers/guildCtrl';
import { CommandProtocol } from './models/Guild';
import { embed, getRandomColor, getRandom, embedImage } from './utils';
import environment from './config/endpoints.config';

const guildCtrl = new GuildCtrl();

const prefix = environment.prefix || '!';
const defaultCommands = ['add', 'remove', 'update', 'help'];

declare global {
  interface Array<T> {
    flat(num: number | undefined): Array<T>;
  }
}

Array.prototype.flat = function flat(num: number | undefined) {
  if (num) num = undefined;

  const stack = [...this];
  const res = [];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  return res.reverse();
};

function IsAdmOrAuthor(msg: Message, command: CommandProtocol | undefined) {
  if (!command) return false;
  let isAdmin = false;
  if (msg.member) isAdmin = msg.member.hasPermission('ADMINISTRATOR');
  return isAdmin || msg.author.id === command.author.id;
}

async function createCommand(
  msg: Message,
  args: string[],
  guildId: string,
): Promise<undefined> {
  if (args.length < 2) {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: `Digite ${prefix}add <input> <output> para criar um novo comando`,
          value: 'exemplo',
        },
        { name: `${prefix}add dia bom dia!`, value: 'vira:' },
        { name: `${prefix}dia`, value: `'bom dia!'` },
      ]),
    );
    return;
  }

  const command = {
    input: args[0].trim(),
    output: args.slice(1).join(' ').trim(),
    author: msg.author,
  };

  if (defaultCommands.find((cmdName) => cmdName === command.input)) {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: `Comandos embutidos não podem ser modificados`,
          value: `impossível criar '${prefix}${command.input}'`,
        },
      ]),
    );
    return;
  }
  try {
    const commands = (await guildCtrl.addCommand(
      command,
      guildId,
    )) as CommandProtocol[];
    commands.push(command);
    msg.channel.send(
      embed('#00ff00', [
        {
          name: 'Comando criado com exito!',
          value: `Digite ${prefix}${command.input}`,
        },
        {
          name: 'Seus comandos',
          value: commands.map((cmd) => cmd.input).join(', ') || ':(',
        },
      ]),
    );
  } catch (e) {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: 'Esse server já tem esse comando!',
          value: `tente usar um nome diferente ou use '${prefix}update <input> <output>' para atualizar o comando`,
        },
        { name: '--------', value: 'Exemplo' },
        { name: `${prefix}update dia bom dia!`, value: 'vira:' },
        { name: `${prefix}dia`, value: `'bom dia!'` },
      ]),
    );
  }
}

async function sendHelpMessage(msg: Message, guildId: string): Promise<void> {
  const commands = (await guildCtrl.getCommands(guildId)) as CommandProtocol[];
  const inputs = commands.map((cmd: CommandProtocol) => cmd.input);

  msg.channel.send(
    inputs.length === 0
      ? embed('#ff0000', [
          {
            name: 'Nao existem comandos nesse servidor',
            value: 'tente fazer o seguinte',
          },
          { name: `${prefix}add dia bom dia!`, value: 'vira' },
          { name: `${prefix}dia`, value: `'bom dia!'` },
        ])
      : embed(getRandomColor(), [
          { name: 'Comandos embutidos', value: defaultCommands.join(', ') },
          { name: 'Comandos criados', value: inputs.join(', ') },
          { name: 'Prefixo', value: prefix },
          { name: 'Exemplo', value: prefix + getRandom(inputs) },
        ]),
  );
}

async function removeCommand(
  msg: Message,
  args: string[],
  guildId: string,
): Promise<void> {
  const commands = (await guildCtrl.getCommands(guildId)) as CommandProtocol[];
  const toBeRemovedCommand = commands.find((cmd) => cmd.input === args[0]);

  if (
    args.length === 0 ||
    defaultCommands.find((cmd) => cmd === args[0]) ||
    !IsAdmOrAuthor(msg, toBeRemovedCommand)
  ) {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: 'Esse comando não existe ou você não consegue deleta-lo',
          value: `${prefix}help para ver todos os comandos`,
        },
      ]),
    );
  } else {
    guildCtrl.removeCommand(args[0], guildId);
    msg.channel.send(
      embed(getRandomColor(), [
        {
          name: `Comando '${prefix}${args[0]}' removido`,
          value: `${prefix}help para ver todos os comandos`,
        },
      ]),
    );
  }
}

async function sendCommand(
  msg: Message,
  cmdName: string,
  guildId: string,
): Promise<void> {
  const commands = (await guildCtrl.getCommands(guildId)) as CommandProtocol[];
  const command = commands.find(
    (cmd: CommandProtocol) => cmd.input === cmdName,
  );
  if (command) {
    if (command.output.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
      msg.channel.send(embedImage(command.output, command.author));
    } else {
      msg.channel.send(
        embed(getRandomColor(), [
          { name: command.output, value: msg.author.toString() },
        ]),
      );
    }
  } else {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: 'Não tenho esse comando nesse servidor!',
          value: msg.author.toString(),
        },
      ]),
    );
  }
}

async function updateCommand(
  msg: Message,
  args: string[],
  guildId: string,
): Promise<undefined | void> {
  const commands = (await guildCtrl.getCommands(guildId)) as CommandProtocol[];
  const randomCommand = getRandom(commands);
  const updatingCommand = commands.find((cmd) => cmd.input === args[0]);

  if (defaultCommands.find((cmdName) => cmdName === args[0])) {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: `Comandos embutidos não podem ser modificados`,
          value: `impossível criar '${prefix}${args[0]}'`,
        },
      ]),
    );
  } else if (args.length < 2) {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: `Digite ${prefix}update <input> <output> para atualizar um comando`,
          value: 'exemplo',
        },
        {
          name:
            commands.length > 0
              ? `${prefix}update ${randomCommand.input} bom dia!`
              : '!add <input> <output> para adicionar um comando',
          value: 'vira',
        },
        { name: `${prefix}dia`, value: `'bom dia!'` },
      ]),
    );
  } else if (!(await guildCtrl.hasCommand(args[0], guildId))) {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: `Esse comando não existe`,
          value: `impossível atualizar '${prefix}${args[0]}'`,
        },
      ]),
    );
  } else if (!IsAdmOrAuthor(msg, updatingCommand)) {
    msg.channel.send(
      embed('#ff0000', [
        {
          name: 'você não pode atualizar esse comando',
          value: `${prefix}help para ver todos os comandos`,
        },
      ]),
    );
  } else {
    const newCommand = {
      author: msg.author,
      input: args[0],
      output: args.slice(1).join(' '),
    };

    await guildCtrl.updateCommand(newCommand, guildId);
    msg.channel.send(
      embed('#00ff00', [
        {
          name: 'Comando atualizado com exito!',
          value: `Digite ${prefix}${args[0]}`,
        },
      ]),
    );
  }
}

export default {
  createCommand,
  sendHelpMessage,
  removeCommand,
  updateCommand,
  sendCommand,
  defaultCommands,
};
