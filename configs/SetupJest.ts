const jestGlobal = global as any;

// tslint:disable-next-line:no-var-requires
jestGlobal.fetch = require('jest-fetch-mock');
