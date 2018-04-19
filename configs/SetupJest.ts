const jestGlobal = global as any;

// tslint:disable-next-line:no-var-requires
jestGlobal.fetch = require('jest-fetch-mock');

// Mock out createObjectURL since it is not available in a fake browser.
jestGlobal.window.URL.createObjectURL = jest.fn();
