# Echoin Integration Test

## Requirement

- node `^8.0.0`
- yarn `^1.0.0` or npm `^5.0.0`

## Installation

```bash
# get latest version of web3-ec
git clone https://github.com/CyberMiles/web3-ec.js /path_to/web3-ec.js
cd /path_to/web3-ec.js
git checkout master
yarn install    # (or `npm install`)
# prepare for web3-ec package linking
yarn link       # (or `npm link`)

# goes back to the test/integration directory
cd -
# link to local version of web3-ec package(or `npm link "web3-ec"`)
yarn link "web3-ec"
# Install project dependencies(or `npm install`)
yarn install
```

## Usage

```bash
# run all test cases
yarn test

# run test cases in a specified test file(e.g. 1.stake.test.js).
node_modules/mocha/bin/mocha -t 300000 1.stake.test.js

# generate a standalone HTML/CSS report to helps visualize your test runs
node_modules/mocha/bin/mocha -t 300000 1.stake.test.js --reporter mochawesome
```
