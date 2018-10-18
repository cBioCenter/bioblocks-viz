// tslint:disable-next-line:export-name
export const capitalizeFirstLetter = (text: string) =>
  `${text.substr(0, 1).toLocaleUpperCase()}${text.substr(1).toLocaleLowerCase()}`;
