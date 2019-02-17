import getWeb3 from './web3'
import MillionDollarContract from './build/MillionDollarContract.json'

export default window => {
  const web3 = getWeb3(window)

  const instance = new web3.eth.Contract(
    JSON.parse(MillionDollarContract).abi,
    '0x375b5686FE5D9ADaFeEd07492CE323a70e042Fce'
  )
  return instance
}
