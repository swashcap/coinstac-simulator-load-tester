'use strict';

const coinstacSimulator = require('coinstac-simulator');
const constants = require('./constants.json');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { parseNumber, writeRandomBytes } = require('./utils');
const path = require('path');
const pify = require('pify');
const pkg = require('../package.json');
const program = require('commander');
const rimraf = require('rimraf');

const tmpPath = path.join(__dirname, '..', '.tmp');

// process.on('exit', () => rimraf.sync(tmpPath));

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

pify(rimraf)(tmpPath)
  .then(() => pify(mkdirp)(tmpPath))
  .then(() => {
    const writeFile = pify(fs.writeFile);

    return Promise.all([
      writeFile(path.join(tmpPath, 'clientCount'), program.clients),
      writeFile(path.join(tmpPath, 'iterationCount'), program.iterations),
      writeRandomBytes(path.join(tmpPath, 'randomBytes'), 1024 * 1024),
    ]);
  })
  .then(() => coinstacSimulator.run(path.join(__dirname, 'declaration.js')))
  .catch(error => console.error(error));

