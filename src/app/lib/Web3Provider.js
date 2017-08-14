// @flow
/*
 * Handle web3 from here, so we know that the same instance is used throughout the application,
 *
 * Trying to get web3 before it has been set will cause an error to be thrown.
 * Trying to set web3 after it has already been set will cause an error to be thrown.
 *
 * WIP
 *
 */
import Web3 from '../../web3/Web3';

let _web3: ?Web3;

class Web3Provider {

    static init(web3: any): Web3 {
        if (_web3) {
            throw new Error("web3 has already been set.");
        }
        _web3 = Web3.createNew(web3);
        return _web3;
    }

    static web3(): Web3 {
        if (!_web3) {
            throw new Error("web3 has not been set.");
        }
        return _web3;
    }

}

export default Web3Provider;