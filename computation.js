'use strict';

const pkg = require('./package.json');

module.exports = {
  local: {
    fn: opts => {
    },
    type: 'function',
  },
  name: pkg.name,
  remote: {
    fn: opts => {
    },
    type: 'function',
  },
  version: pkg.version,
};

