const MillionDollarContract = require('./build/MillionDollarContract.json')
const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const { mnemonic, networkLink } = require('./config')

const provider = new HDWalletProvider(mnemonic, networkLink)

const web3 = new Web3(provider)

const deploy = async () => {
  accounts = await web3.eth.getAccounts()

  console.log('trying to deploy contract with account', accounts[0])
  parsedContract = JSON.parse(MillionDollarContract)
  const contract = await new web3.eth.Contract(parsedContract.abi)
    .deploy({
      data: '0x' + parsedContract.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: '1000000' })

  console.log('deployed contract to:' + contract.options.address)
}

deploy()
