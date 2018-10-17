const generateDefaultHeaderIndices = (items: string[]): { [key: string]: number } => ({
  A_i: items.length - 2,
  A_j: items.length - 1,
  cn: 2,
  dist: 3,
  i: 0,
  j: 1,
});

// tslint:disable-next-line:export-name
export const getCouplingHeaderIndices = (items: string[], areHeadersPresent: boolean) => {
  if (!areHeadersPresent) {
    return generateDefaultHeaderIndices(items);
  } else {
    const result: { [key: string]: number } = {};
    items.filter(item => item.length >= 1).map(header => {
      // Trim to remove whitespace, newlines, carriage returns, etc.
      result[header.trim()] = items.indexOf(header);
    });

    return result;
  }
};
