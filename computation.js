'use strict';

const concatStream = require('concat-stream');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

console.log('computation.js');


module.exports = {
  local: {
    /**
     * Local function.
     *
     * @param {Object} params
     * @param {Object} params.remoteResult
     * @param {string} [params.previousData]
     * @returns {Promise} Resolves to a string
     */
    fn: params => {
      return new Promise((resolve, reject) => {
        const hasher = crypto.createHash('sha256');
        const reader = fs.createReadStream(path.join(__dirname, 'randomBytes'));
        reader.on('error', reject);
        reader.pipe(hasher).pipe(concatStream(resolve));
      })
        .then(
          hash => {
            console.log(hash);
            return hash;
          }, 
          error => {
            console.error(error);
            throw error;
          }
        );
    },
    type: 'function',
  },
  name: pkg.name,
  plugins: ['group-step'],
  remote: {
    /**
     * Remote function.
     *
     * @param {Object} params
     * @param {string[]} params.usernames
     * @param {Object[]} params.userResults
     * @param {Object} [params.previousData]
     * @returns {Object}
     */
    fn: params => {
      const result = Object.assign(
        {},
        {
          complete: false,
          iteration: 0,
        },
        params.previousData
      );

      result.iteration++;

      // Mark pipeline step as 'complete' after 100 iterations.
      if (result.iteration >= 2) {
        result.complete = true;
      }

      return result;
    },
    type: 'function',
  },
  version: pkg.version,
};

