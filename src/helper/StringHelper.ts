/**
 * Sets the first letter to uppercase and the rest to lowercase.
 *
 * @param text Text to be transformed.
 */
export const capitalizeFirstLetter = (text: string) =>
  `${text.substr(0, 1).toLocaleUpperCase()}${text.substr(1).toLocaleLowerCase()}`;

/**
 * Sets the first letter of every word to uppercase and the rest to lowercase.
 *
 * @param text Text to be transformed.
 * @param [separator=' '] How to split `text` into words.
 */
export const capitalizeEveryWord = (text: string, separator: string = ' ') =>
  text
    .split(separator)
    .map(word => `${word.substr(0, 1).toLocaleUpperCase()}${word.substr(1).toLocaleLowerCase()}`)
    .join(separator);
