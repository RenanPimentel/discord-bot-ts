import { MessageEmbed } from 'discord.js';

interface Field {
  name: string;
  value: string;
}

const isImageRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

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

function embed(color: string, fields: Field[]): MessageEmbed {
  const embed = new MessageEmbed().setColor(color).setTimestamp(Date.now());

  fields.forEach(({ name, value }) => {
    if (name.match(isImageRegex)) {
      embed.setImage(name);
      embed.setFooter(value);
    } else {
      embed.addField(name, value);
    }
  });

  return embed;
}

export default { embed, getRandomColor, getRandom };
