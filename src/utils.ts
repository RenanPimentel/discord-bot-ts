// import { MessageEmbed } from 'discord.js';

// const urlRegex =
//   /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

declare global {
  interface Array<T> {
    getRandom(): T;
  }
}

Array.prototype.getRandom = function getRandom<T>(): T {
  return this[Math.floor(Math.random() * this.length)];
};

const getRandomColor = (): string => {
  const hexValues = '0123456789ABCDEF'.split('');
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hexValues.getRandom();
  }

  return color;
};

interface Field {
  name: string;
  value: string;
}

function embed(color: string, fields: Field[]): string {
  // const embed = new MessageEmbed().setColor(color).setTimestamp(Date.now());
  // fields = Array.from(fields);

  // embed.addFields(...fields);
  // fields.forEach(({ name }) => {
  //   if (name.match(urlRegex)) {
  //     embed.setImage(name);
  //   }
  // });

  // return embed;

  return fields.map(({ name, value }) => `${name}: ${value}`).join('\n');
}

export default { embed, getRandomColor };
