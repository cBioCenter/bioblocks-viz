// @ts-ignore
const generateWallabyConfig = wallaby => {
  return {
    env: {
      params: { env: 'NODE_ENV=test' },
      runner: 'node',
      type: 'node',
    },
    files: [
      { pattern: 'test/SetupJest.ts', load: true, ignore: false },
      'tsconfig.json',
      'test/__mocks__/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      'src/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      '!src/**/*.test.ts?(x)',
    ],
    setup: w => {
      // https://github.com/wallabyjs/public/issues/1497
      const jestConfig = require('./package.json').jest;
      Object.keys(jestConfig.transform || {}).forEach(
        // tslint:disable-next-line:no-bitwise
        k => ~k.indexOf('^.+\\.(js|jsx') && void delete jestConfig.transform[k],
      );
      delete jestConfig.testEnvironment;
      w.testFramework.configure(jestConfig);
    },
    testFramework: 'jest',
    tests: ['src/**/*.test.ts?(x)'],
  };
};

module.exports = generateWallabyConfig;
