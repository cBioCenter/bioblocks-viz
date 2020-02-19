/**
 * Get the default header names/positions taken from the format of couplingScores.csv on EVServer.
 * @param items A single row of elements needed to determine column count.
 */
export const generateDefaultHeaderIndices = (items: string[]): { [key: string]: number } => ({
  A_i: items.length - 2,
  A_j: items.length - 1,
  cn: 2,
  dist: 3,
  i: 0,
  j: 1,
});

/**
 * Get all of the headers in a nicely formatted object.
 * @param items List of headers.
 */
// tslint:disable-next-line:export-name
export const getCouplingHeaderIndices = (items: string[]) => {
  const result: { [key: string]: number } = {};
  items
    .filter(item => item.length >= 1)
    .map(header => {
      // Trim to remove whitespace, newlines, carriage returns, etc.
      result[header.trim()] = items.indexOf(header);
    });

  return result;
};
