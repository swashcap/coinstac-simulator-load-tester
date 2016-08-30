'use strict';

const crypto = require('crypto');
const fs = require('fs');
const pify = require('pify');

/**
 * Write random bytes to file.
 *
 * @param {string} filename
 * @param {number} bytes
 * @returns {Promise}
 */
function writeRandomBytes(filename, bytes) {
  return pify(crypto.randomBytes)(bytes)
    .then(buffer => pify(fs.writeFile)(filename, buffer));
}

/**
 * Parse and validate a number.
 *
 * @throws {Error}
 * @param {string} value
 * @returns {number}
 */
function parseNumber(value) {
  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new Error(`Couldn't parse number ${value}`);
  } else if (parsed <= 0) {
    throw new Error(`Number ${parsed} must be positive`);
  }

  return parsed;
}

module.exports = {
  parseNumber,
  writeRandomBytes,
};

