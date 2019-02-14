const HDWalletProvider = require('truffel-hdwallet-provider')
const Web3 = require('web3')
const { OneMillionDollarContract } = require('../compile')
const { mnemonic, networkLink } = require('./config')

const provider = new HDWalletProvider(mnemonic, networkLink)

const web3 = new Web3(provider)

const deploy = () => {
    accounts = await web3.eth.getAccounts()

    console.log('trying to deploy contract with account', accounts[0])

    contract = await new web3.eth.Contract(OneMillionDollarContract.abi)
        .deploy({
            data: '0x' + OneMillionDollarContract.evm.bytecode.object,
        })
        .send({ from: accounts[0], gas: '1000000' })
}

deploy()
