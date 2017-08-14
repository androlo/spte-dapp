// @flow
import VersionAPI from "./VersionAPI"
import EthAPI from "./EthAPI"

class Web3 {
    _web3: any;
    _eth: EthAPI;
    _version: VersionAPI;

    static createNew(web3: any) {
        return new Web3(web3, web3.version, web3.eth);
    }

    constructor(web3: any, version: any, eth: any) {
        this._web3 = web3;
        this._version = version;
        this._eth = eth;
    }

    get eth(): EthAPI {
        return this._eth;
    }

    get version(): VersionAPI {
        return this._version;
    }

    isConnected(): boolean {
        return this._web3.isConnected();
    }

    isAddress(str: string): boolean {
        return this._web3.isAddress(str);
    }

    sha3(str: string, options?: { encoding: 'hex' }): string {
        return this._web3.sha3(str, options);
    }

    reset(keepIsSyncing: boolean) {
        this._web3.reset(keepIsSyncing);
    }

}

export default Web3;