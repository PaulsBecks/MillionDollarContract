import Web3 from 'web3'
import { networkLink } from './config'

export default window => {
  let web3
  console.log(window) //, typeof window, typeof window !== undefined)
  if (
    window !== undefined &&
    typeof window !== undefined &&
    typeof window.web3 !== undefined
  ) {
    console.log('use metamask', window.web3.currentProvider)
    web3 = new Web3(window.web3.currentProvider)
  } else {
    console.log('use infura')
    const provider = new Web3.providers.HttpProvider(networkLink)
    web3 = new Web3(provider)
  }
  return web3
}
