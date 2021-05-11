import { MessageEmbed } from 'discord.js';

interface Field {
  name: string;
  value: string;
}

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomColor(): string {
  const hexValues = '0123456789ABCDEF'.split('');
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += getRandom(hexValues);
  }

  return color;
}

function embedImage(
  url: string,
  embed: MessageEmbed = new MessageEmbed(),
): MessageEmbed {
  if (url.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
    embed.setThumbnail(url).setColor(getRandomColor());
  }

  return embed;
}

function embed(color: string, fields: Field[]): MessageEmbed {
  const embed = new MessageEmbed().setColor(color).setTimestamp(Date.now());
  fields.forEach(({ name, value }) => embed.addField(name, value));
  return embed;
}

export default { embed, getRandomColor, getRandom, embedImage };
