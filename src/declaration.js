'use strict';

const constants = require('./constants.json');
const fs = require('fs');
const { parseNumber } = require('./utils');
const path = require('path');

let clientCount;

try {
  clientCount = parseNumber(fs.readFileSync(
    path.join(__dirname, '..', '.tmp', 'clientCount')
  ).toString());
} catch (error) {
  clientCount = constants.DEFAULT_CLIENT_COUNT;
}

module.exports = {
  computationPath: path.join(__dirname, 'computation.js'),
  local: new Array(clientCount),
  verbose: true,
};

