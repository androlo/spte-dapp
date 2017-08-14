// @flow
import Web3Provider from '../lib/Web3Provider'

export default class StringIsAddressValidator {
    static validate(str: string): boolean {
        return Web3Provider.web3().isAddress(str);
    }
}