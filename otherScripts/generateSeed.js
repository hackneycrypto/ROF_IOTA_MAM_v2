/* eslint-disable no-console */
//
// Generates an IOTA Seed Address to be used in MAM Channel
//

const execSync = require('child_process').execSync;
// import { execSync } from 'child_process';  // replace ^ if using ES modules
const generatedSeedOutput = execSync("cat /dev/urandom |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1", { encoding: 'utf-8' });  // the default is 'buffer'
// eslint-disable-next-line no-console
console.log('Output was:\n',generatedSeedOutput);