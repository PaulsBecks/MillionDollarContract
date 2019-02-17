const path = require('path')
const fs = require('fs-extra')
const solc = require('solc')

const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)

const millionDollarContractPath = path.resolve(
    __dirname,
    'contracts',
    'MillionDollarContract.sol'
)

const input = {
    language: 'Solidity',
    sources: {
        'MillionDollarContract.sol': {
            content: fs.readFileSync(millionDollarContractPath, 'utf8'),
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
}

MillionDollarContract = JSON.parse(solc.compile(JSON.stringify(input)))
    .contracts['MillionDollarContract.sol']

fs.ensureDirSync(buildPath)
fs.outputJsonSync(
    path.resolve(buildPath, 'MillionDollarContract.json'),
    JSON.stringify(MillionDollarContract['OneMillionDollarContract'])
)
