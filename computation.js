'use strict';

const concatStream = require('concat-stream');
const constants = require('./constants.json');
const crypto = require('crypto');
const fs = require('fs');
const parseNumber = require('./parse-number');
const path = require('path');
const pkg = require('./package.json');

const randomBytesPath = path.join(__dirname, '.tmp', 'randomBytes');
let iterationCount;

try {
  iterationCount = parseNumber(
    fs.readFileSync(path.join(__dirname, '.tmp', 'iterationCount')).toString()
  );
} catch (error) {
  iterationCount = constants.DEFAULT_ITERATION_COUNT;
}

module.exports = {
  local: {
    /**
     * Local function.
     *
     * @param {Object} params
     * @param {Object} params.remoteResult
     * @param {string} [params.previousData]
     * @returns {Promise} Resolves to an array containing the hash and the
     * duration of the computation.
     */
    fn: params => {
      return new Promise((resolve, reject) => {
        const hasher = crypto.createHash('sha256');
        const reader = fs.createReadStream(randomBytesPath);
        const start = Date.now();
        reader.on('error', reject);
        reader.pipe(hasher).pipe(concatStream(hash => {
          resolve([hash.toString('hex'), Date.now() - start]);
        }));
      })
        // TODO: Determine whether coinstac-common catches rejections
        .catch(error => {
          console.error(error);
          throw error;
        });
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
     * @param {Object} params.userResults.data Results from the `local`
     * computation.
     * @param {Object} [params.previousData]
     * @returns {Object}
     */
    fn: params => {
      const result = Object.assign(
        {},
        {
          complete: false,
          iteration: 0,
          localTimes: [],
          start: Date.now(),
        },
        params.previousData
      );

      // Add current iteration's times
      if (Array.isArray(params.userResults)) {
        const localTimes = params.userResults.reduce((memo, userResult) => {
          return ('data' in userResult && Array.isArray(userResult.data)) ?
            memo.concat(userResult.data[1]) :
            memo;
        }, []);

        Array.prototype.push.apply(result.localTimes, localTimes);
      }

      result.iteration++;

      // Mark pipeline step as 'complete' max iterations:
      if (result.iteration >= iterationCount) {
        result.complete = true;

        const averageLocalTime = Math.round(
          result.localTimes.reduce((total, localTime) => total + localTime) /
          result.localTimes.length
        );
        const time = Date.now() - result.start;

        console.log(`${iterationCount} iterations complete in ${time}ms`);
        console.log(`Average client time: ${averageLocalTime}ms`);
        console.log(`Client count: ${params.usernames.length}`);
      }

      return result;
    },
    type: 'function',
  },
  version: pkg.version,
};

