// import
const path = require('path');
const solc = require('solc');
// file system module
const fs = require('fs-extra');

// remove build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// read campaign contract
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// compile everything
const output = solc.compile(source, 1).contracts;

// create build folder and checks before that it doesn't exist
fs.ensureDirSync(buildPath);

// loop each contract and create a file
// looks into compiled code of output, gets each contract and pastes the content of it in a new file
for (let contract in output) {
    let name = contract.replace(':', '');
    fs.outputJsonSync(
        path.resolve(buildPath, name + '.json'),
        output[contract]
    );
};