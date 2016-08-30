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

const users = [];

for (let i = 0; i < clientCount; i++) {
  users.push({
    username: `loadTestUser${i}`,
    userData: null,
  });
}

module.exports = {
  computationPath: path.join(__dirname, 'computation.js'),
  verbose: true,
  users,
};

