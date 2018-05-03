module.exports = wallaby => {
  return {
    env: {
      runner: 'node',
      type: 'node',
    },
    files: [
      'tsconfig.json',
      'src/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      '!src/**/*.test.ts?(x)',
    ],
    testFramework: 'jest',
    tests: ['src/**/*.test.ts?(x)'],
  };
};
