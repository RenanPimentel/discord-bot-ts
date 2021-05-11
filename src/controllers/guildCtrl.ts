import { Guild, CommandProtocol, GuildProtocol } from '../models/Guild';

interface GuildCtrlProtocol {
  getGuild(guildId: string): Promise<GuildProtocol | null>;
  addGuild(guildId: string): Promise<GuildProtocol | null>;
  removeGuild(guildId: string): Promise<GuildProtocol | null>;
  getCommands(guildId: string): Promise<CommandProtocol[] | null>;
  updateCommand(
    command: CommandProtocol,
    guildId: string,
  ): Promise<CommandProtocol[] | null>;
  removeCommand(
    input: string,
    guildId: string,
  ): Promise<CommandProtocol[] | null>;
  hasCommand(input: string, guildId: string): Promise<boolean>;
  addCommand(
    command: CommandProtocol,
    guildId: string,
  ): Promise<CommandProtocol[] | null>;
}

export class GuildCtrl implements GuildCtrlProtocol {
  async getGuild(guildId: string): Promise<GuildProtocol | null> {
    try {
      return Guild.findOne({ id: guildId });
    } catch (e) {
      console.log(e.message, 'in GuildCtrl.getGuild');
      return null;
    }
  }

  async addGuild(guildId: string): Promise<GuildProtocol | null> {
    try {
      return Guild.create({ id: guildId });
    } catch (e) {
      console.log(e.message, 'in GuildCtrl.addGuild');
      return null;
    }
  }

  async removeGuild(guildId: string): Promise<GuildProtocol | null> {
    try {
      return Guild.remove({ id: guildId });
    } catch (e) {
      console.log(e.message, 'in GuildCtrl.removeGuild');
      return null;
    }
  }

  async getCommands(guildId: string): Promise<CommandProtocol[] | null> {
    try {
      const guild = (await this.getGuild(guildId)) as GuildProtocol;
      if (!guild) {
        const guildAdded = await this.addGuild(guildId);
        return guildAdded && guildAdded.commands;
      }
      return guild.commands;
    } catch (e) {
      console.log(e.message, 'in GuildCtrl.getCommands');
      return null;
    }
  }

  async updateCommand(
    command: CommandProtocol,
    guildId: string,
  ): Promise<CommandProtocol[] | null> {
    try {
      const newCommands = await this.getCommands(guildId);

      if (!newCommands) return null;

      const index = newCommands.findIndex((cmd) => cmd.input === command.input);

      if (index === -1) return null;

      newCommands[index].output = command.output;
      console.log({ newCommands });
      Guild.findOneAndUpdate(
        { id: guildId },
        { commands: [...newCommands] },
        { useFindAndModify: false },
      );
      console.log({ newCommands });
      return newCommands;
    } catch (e) {
      console.log(e.message, 'in GuildCtrl.updateCommand');
      return null;
    }
  }

  async removeCommand(
    input: string,
    guildId: string,
  ): Promise<CommandProtocol[] | null> {
    try {
      const guild = (await this.getGuild(guildId)) as GuildProtocol;
      const newCommands = [...guild.commands];

      const index = newCommands.findIndex(
        (cmd: CommandProtocol) => cmd.input == input,
      );

      newCommands.splice(index, 1)[0];

      await Guild.findOneAndUpdate(
        { id: guildId },
        { commands: [...newCommands] },
        { useFindAndModify: false },
      );

      return newCommands;
    } catch (e) {
      console.log(e.message, 'in GuildCtrl.removeCommand');
      return null;
    }
  }

  async hasCommand(input: string, guildId: string): Promise<boolean> {
    try {
      const guild = await Guild.findOne({ id: guildId });
      return Boolean(
        guild.commands.find((cmd: CommandProtocol) => cmd.input === input),
      );
    } catch (e) {
      console.log(e.message + ' in GuildCtrl.hasCommand');
      return false;
    }
  }

  async addCommand(
    command: CommandProtocol,
    guildId: string,
  ): Promise<CommandProtocol[] | null> {
    try {
      const commands = (await this.getCommands(guildId)) as CommandProtocol[];

      if (await this.hasCommand(command.input, guildId)) return null;

      const updatedGuild = (await Guild.findOneAndUpdate(
        { id: guildId },
        { commands: [...commands, command] },
        { useFindAndModify: false },
      )) as GuildProtocol;

      return updatedGuild.commands;
    } catch (e) {
      console.log(e.message, 'in GuildCtrl.addCommand');
      return null;
    }
  }
}
