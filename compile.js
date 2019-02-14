const path = require("path");
const fs = require("fs");
const solc = require("solc");

const millionDollarContractPath = path.resolve(
  __dirname,
  "contracts",
  "MillionDollarContract.sol"
);

const input = {
  language: "Solidity",
  sources: {
    "MillionDollarContract.sol": {
      content: fs.readFileSync(millionDollarContractPath, "utf8")
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "MillionDollarContract.sol"
];
