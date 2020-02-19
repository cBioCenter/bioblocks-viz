/**
 * Helper function to check array equality by __value__, meaning the same amount of elements in the same order.
 *
 * @param a First array.
 * @param b Second array.
 * @returns
 * `true` if they are equal, `false` if they are not.
 */
// tslint:disable-next-line: export-name
export const areTwoArraysEqual = <T>(a: T[], b: T[]) => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0, len = a.length; i < len; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};
