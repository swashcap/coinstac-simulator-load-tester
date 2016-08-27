'use strict';

const coinstacSimulator = require('coinstac-simulator');
const cp = require('child_process');
const fs = require('fs');
const mkdirp = require('mkdirp');
const parseNumber = require('./parse-number');
const path = require('path');
const pify = require('pify');
const pkg = require('./package.json');
const program = require('commander');
const rimraf = require('rimraf');

const DEFAULT_CLIENTS = 3;
const DEFAULT_ITERATIONS = 10;

const declaration = {
  computationPath: path.join(__dirname, 'computation.js'),
  verbose: true,
  users: null,
};
const tmpPath = path.join(__dirname, '.tmp');

let clientCount;
let iterationCount;

if (require.main === module) {
  program
    .version(pkg.version)
    .description(pkg.description)
    .option(
      '-c, --clients [value]',
      'Number of clients',
      parseNumber,
      DEFAULT_CLIENTS)
    .option(
      '-i, --iterations [value]',
      'Number of computation iterations',
      parseNumber,
      DEFAULT_ITERATIONS
    )
    .parse(process.argv);

  clientCount = program.clients;
  iterationCount = program.iterations;
} else {
  clientCount = DEFAULT_CLIENTS;
  iterationCount = DEFAULT_ITERATIONS;
}

declaration.users = [];

for (let i = 0; i < clientCount; i++) {
  declaration.users.push({
    username: `loadTestUser${i}`,
    userData: null,
  });
}

pify(rimraf)(tmpPath)
  .then(() => pify(mkdirp)(tmpPath))
  .then(() => {
    const writeFile = pify(fs.writeFile);
    const declarationPath = path.join(tmpPath, 'declaration.json');

    return Promise.all([
      declarationPath,
      writeFile(declarationPath, JSON.stringify(declaration, null, 2)),
      writeFile(path.join(tmpPath, 'iterationCount'), iterationCount),
      pify(cp.exec)(`mkfile -n 1m ${path.join(tmpPath, 'randomBytes')}`),
    ]);
  })
  .then(([declarationPath]) => coinstacSimulator.run(declarationPath));

module.exports = declaration;

