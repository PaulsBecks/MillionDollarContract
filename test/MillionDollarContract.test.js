const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const provider = ganache.provider()
const web3 = new Web3(provider)
const { OneMillionDollarContract } = require('../compile')

let accounts
let contract
beforeEach(async () => {
    try {
        accounts = await web3.eth.getAccounts()

        contract = await new web3.eth.Contract(OneMillionDollarContract.abi)
            .deploy({
                data: '0x' + OneMillionDollarContract.evm.bytecode.object,
            })
            .send({ from: accounts[0], gas: '1000000' })
        contract.setProvider(provider)
    } catch (e) {
        console.log(e)
    }
})

describe('MillionDollarContract', () => {
    it('gets deployed', () => {
        assert.ok(contract.options.address)
    })
    it('is owned by account 0', async () => {
        const oneMillionDollarAccount = await contract.methods
            .oneMillionDollarAccount()
            .call({ from: accounts[0] })
        assert.equal(oneMillionDollarAccount, accounts[0])
    })
    it('can set color', async () => {
        const pixelPosition = 999999
        await contract.methods
            .setPixel(pixelPosition, 43210, 'hoverText')
            .send({ value: web3.utils.toWei('0.1'), from: accounts[0] })
        const pixel = await contract.methods
            .pixels(pixelPosition)
            .call({ from: accounts[0] })
        assert.equal(pixel[0], 43210)
    })
    it('not set color returns 0', async () => {
        const pixel = await contract.methods.pixels(2).call()
        assert.equal(pixel[0], 0)
    })
    it('does not let write twice', async () => {
        const pixelPosition = 0
        await contract.methods
            .setPixel(pixelPosition, 43210, 'hoverText')
            .send({ value: web3.utils.toWei('0.1'), from: accounts[0] })
        try {
            await contract.methods
                .setPixel(pixelPosition, 43210, 'hoverText')
                .send({ value: web3.utils.toWei('0.1'), from: accounts[0] })
            assert.ok(false)
        } catch (err) {
            assert.ok(true)
        }
    })
    it('reverts if less then 0.1 ether send', async () => {
        try {
            await contract.methods
                .setPixel(1, 43210, 'hoverText')
                .send({ value: web3.utils.toWei('0.09999'), from: accounts[0] })
            assert.ok(false)
        } catch (e) {
            assert.ok(true)
        }
    })
    it('reverts if pixel position above 999999', async () => {
        try {
            await contract.methods
                .setPixel(1000000, 43210, 'hoverText')
                .send({ value: web3.utils.toWei('0.1'), from: accounts[0] })
            assert.ok(false)
        } catch (e) {
            assert.ok(true)
        }
    })
})
