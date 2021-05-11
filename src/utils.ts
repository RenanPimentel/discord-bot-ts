import { MessageEmbed } from 'discord.js';

const urlRegex =
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// declare global {
//   interface Array<T> {
//     getRandom(): T;
//   }
// }

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const getRandomColor = (): string => {
  const hexValues = '0123456789ABCDEF'.split('');
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += getRandom(hexValues);
  }

  return color;
};

interface Field {
  name: string;
  value: string;
}

function embed(color: string, fields: Field[]): MessageEmbed {
  const embed = new MessageEmbed().setColor(color).setTimestamp(Date.now());
  fields = Array.from(fields);
  console.log(fields);
  console.log(fields.flat);
  console.log(fields.reduce);
  embed.addFields(...fields);
  fields.forEach(({ name }) => {
    if (name.match(urlRegex)) {
      embed.setImage(name);
    }
  });

  return embed;

  //  return fields.map(({ name, value }) => `${name}: ${value}`).join('\n');
}

export default { embed, getRandomColor, getRandom };
