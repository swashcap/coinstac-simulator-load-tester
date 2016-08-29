# coinstac-simulator-load-tester

Test loads on coinstac-simulator.

## Purpose

Give basic algorithm development and _coinstac-simulator_ use a go. Attempt to
test _coinstac-simulator_ and COINSTAC’s internals under heavier load.

## Setup

1. You’ll need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com)
   (it comes with Node.js) on your machine to run
   _coinstac-simulator-load-tester_.
2. Clone the repo to your machine:

  ```shell
  git clone git@github.com:swashcap/coinstac-simulator-load-tester.git
  ```

3. Install dependencies:

  ```shell
  cd coinstac-simulator-load-tester
  npm install
  ```

## Running

* Control the number of clients (`-c` or `--clients` flag) and the number of
  each client's iterations (`-i` or `--iterations` flag). Use like so:

  ```shell
  # 10 clients running 20 iterations
  node src/index.js -c 10 -i 20
  ```

  For full CLI help, run `node src/index.js --help`.
* Run the basic test with `npm start`.
* If you have _coinstac-simulator_ already installed you can run the basic test
  by running `coinstac-simulator -d src/declaration.js`
