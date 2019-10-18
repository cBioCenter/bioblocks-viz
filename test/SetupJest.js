"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var Adapter = require("enzyme-adapter-react-16");
enzyme_1.configure({ adapter: new Adapter() });
var jestGlobal = global;
var customGlobal = global;
// tslint:disable-next-line:no-var-requires no-require-imports no-unsafe-any
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;
// Mock out createObjectURL since it is not available in a fake browser.
// tslint:disable-next-line:no-unsafe-any
jestGlobal.window.URL.createObjectURL = jest.fn();
//# sourceMappingURL=SetupJest.js.map