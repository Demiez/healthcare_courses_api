module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  tsconfigFile: 'tsconfig.json',
  testRunner: 'mocha',
  mochaOptions: {
    spec: ['test/**/*.spec.ts'],
    require: ['ts-node/register', 'source-map-support/register'],
    ui: 'bdd',
  },
  coverageAnalysis: 'perTest',
  mutate: ['src/**/*.ts'],
  symlinkNodeModules: false,
};
