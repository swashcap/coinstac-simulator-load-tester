'use strict';

const coinstacSimulator = require('coinstac-simulator');
const constants = require('./constants.json');
const cp = require('child_process');
const fs = require('fs');
const mkdirp = require('mkdirp');
const parseNumber = require('./parse-number');
const path = require('path');
const pify = require('pify');
const pkg = require('../package.json');
const program = require('commander');
const rimraf = require('rimraf');

const tmpPath = path.join(__dirname, '..', '.tmp');

function cleanup() {
  return pify(rimraf)(tmpPath);
}

program
  .version(pkg.version)
  .description(pkg.description)
  .option(
    '-c, --clients [value]',
    'Number of clients',
    parseNumber,
    constants.DEFAULT_CLIENT_COUNT)
  .option(
    '-i, --iterations [value]',
    'Number of computation iterations',
    parseNumber,
    constants.DEFAULT_ITERATION_COUNT
  )
  .parse(process.argv);

cleanup()
  .then(() => pify(mkdirp)(tmpPath))
  .then(() => {
    const writeFile = pify(fs.writeFile);

    return Promise.all([
      writeFile(path.join(tmpPath, 'clientCount'), program.clients),
      writeFile(path.join(tmpPath, 'iterationCount'), program.iterations),
      pify(cp.exec)(`mkfile -n 1m ${path.join(tmpPath, 'randomBytes')}`),
    ]);
  })
  .then(() => coinstacSimulator.run(path.join(__dirname, 'declaration.js')))
  .then(cleanup)
  .catch(error => console.error(error));

