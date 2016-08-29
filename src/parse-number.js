'use strict';

/**
 * Parse and validate a number.
 *
 * @throws {Error}
 * @param {string} value
 * @returns {number}
 */
module.exports = function parseNumber(value) {
  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new Error(`Couldn't parse number ${value}`);
  } else if (parsed <= 0) {
    throw new Error(`Number ${parsed} must be positive`);
  }

  return parsed;
};

