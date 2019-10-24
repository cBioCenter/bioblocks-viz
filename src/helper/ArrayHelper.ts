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
