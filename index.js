'use strict';

const path = require('path');

const USERS_COUNT = 3;
const users = [];

for (let i = 0; i < USERS_COUNT; i++) {
  users.push({
    username: `loadTestUser${i}`,
    userData: null,
  });
}

module.exports = {
  computationPath: path.join(__dirname, 'computation.js'),
  users,
  verbose: true,
};

