const { getProjects } = require('ts-jest');
const ts = require('typescript');
const { pathsToModuleNameMapper } = require('ts-jest');
const { Config } = require('jest');

const { config: tsconfig } = ts.readConfigFile(
  './tsconfig.test.json',
  ts.sys.readFile,
);
const paths = tsconfig?.compilerOptions?.paths ?? {};

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
  testEnvironment: 'node',
};

module.exports = config;
