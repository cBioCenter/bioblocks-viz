export const capitalizeFirstLetter = (text: string) =>
  `${text.substr(0, 1).toLocaleUpperCase()}${text.substr(1).toLocaleLowerCase()}`;

export const capitalizeEveryWord = (text: string) =>
  text
    .split(' ')
    .map(word => `${word.substr(0, 1).toLocaleUpperCase()}${word.substr(1).toLocaleLowerCase()}`)
    .join(' ');
