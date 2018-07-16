const generateWallabyConfig = wallaby => ({
  env: {
    runner: 'node',
    type: 'node',
  },
  files: [
    'configs/SetupJest.ts',
    'tsconfig.json',
    '__mocks__/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
    'src/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
    '!src/**/*.test.ts?(x)',
  ],
  testFramework: 'jest',
  tests: ['src/**/*.test.ts?(x)'],
});

module.exports = generateWallabyConfig;
