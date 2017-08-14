// @flow
import type {
    Address,
    Bytes32,
    Bytes,
    SyncData,
    SyncObject,
    SyncCallback,
    BlockNumberParam,
    Block,
    Filter,
    FilterWatchCallback,
    FilterParams,
    Transaction,
    TransactionReceipt,
    TxInput,
    CallInput,
    Contract
} from './types'

import BigNumber from 'bignumber.js'
import type {AnyNumber} from 'bignumber.js'

import type {ABI} from './contracts/abi'
import {toBytes} from "./types";

class EthAPI {
    _eth: any;

    constructor(eth: any) {
        this._eth = eth;
    }

    get defaultAccount(): Address {
        return this._eth.defaultAccount;
    }

    set defaultAccount(account: Address): void {
        this._eth.defaultAccount = account;
    }

    get defaultBlock(): BlockNumberParam {
        return this._eth.defaultBlock;
    }

    set defaultBlock(block: BlockNumberParam): void {
        this._eth.defaultBlock = block;
    }

    async getSyncing(): Promise<SyncData | boolean> {
        return new Promise((resolve, reject) => {
            this._eth.getSyncing((err: Error, data: SyncData | boolean) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    isSyncing(scb: SyncCallback): SyncObject {
        return this._eth.isSyncing(scb);
    }

    async getCoinbase(): Promise<string> {
        return new Promise((resolve, reject) => {
            this._eth.getCoinbase((err: Error, coinbase: Address) => {
                if (err) {
                    return reject(err);
                }
                return resolve(coinbase);
            });
        });
    }

    async getMining(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._eth.getMining((err: Error, mining: boolean) => {
                if (err) {
                    return reject(err);
                }
                return resolve(mining);
            });
        });
    }

    async getHashrate(): Promise<number> {
        return new Promise((resolve, reject) => {
            this._eth.getHashrate((err: Error, hashrate: number) => {
                if (err) {
                    return reject(err);
                }
                return resolve(hashrate);
            });
        });
    }

    async getGasPrice(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._eth.getGasPrice((err: Error, gasPrice: BigNumber) => {
                if (err) {
                    return reject(err);
                }
                return resolve(gasPrice);
            });
        });
    }

    async getAccounts(): Promise<Address[]> {
        return new Promise((resolve, reject) => {
            this._eth.getAccounts((err: Error, accounts: Address[]) => {
                if (err) {
                    return reject(err);
                }
                return resolve(accounts);
            });
        });
    }

    async getBlockNumber(): Promise<number> {
        return new Promise((resolve, reject) => {
            this._eth.getBlockNumber((err: Error, blockNumber: number) => {
                if (err) {
                    return reject(err);
                }
                return resolve(blockNumber);
            });
        });
    }

    async getBalance(address: Address, defaultBlock?: BlockNumberParam): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._eth.getBalance(address, defaultBlock, (err: Error, balance: BigNumber) => {
                if (err) {
                    return reject(err);
                }
                return resolve(balance);
            });
        });
    }

    async getStorageAt(address: Address, position: number, defaultBlock?: BlockNumberParam): Promise<Bytes32> {
        return new Promise((resolve, reject) => {
            this._eth.getStorageAt(address, position, defaultBlock, (err: Error, data: Bytes32) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    async getCode(address: Address, defaultBlock?: BlockNumberParam): Promise<Bytes> {
        return new Promise((resolve, reject) => {
            this._eth.getCode(address, defaultBlock, (err: Error, code: Bytes) => {
                if (err) {
                    return reject(err);
                }
                return resolve(code);
            });
        });
    }

    async getBlock(blockId: BlockNumberParam | Bytes32, txObjects?: boolean): Promise<Block> {
        return new Promise((resolve, reject) => {
            this._eth.getBlock(blockId, txObjects, (err: Error, block: Block) => {
                if (err) {
                    return reject(err);
                }
                return resolve(block);
            });
        });
    }

    async getBlockTransactionCount(blockId?: BlockNumberParam): Promise<number> {
        return new Promise((resolve, reject) => {
            this._eth.getBlockTransactionCount(blockId, (err: Error, txCount: number) => {
                if (err) {
                    return reject(err);
                }
                return resolve(txCount);
            });
        });
    }

    async getUncle(blockId: BlockNumberParam, uncleNumber: number, txObjects?: boolean): Promise<Block> {
        return new Promise((resolve, reject) => {
            this._eth.getBlock(blockId, uncleNumber, txObjects, (err: Error, uncle: Block) => {
                if (err) {
                    return reject(err);
                }
                return resolve(uncle);
            });
        });
    }

    async getTransaction(transactionHash: Bytes32): Promise<Transaction> {
        return new Promise((resolve, reject) => {
            this._eth.getTransaction(transactionHash, (err: Error, tx: Transaction) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tx);
            });
        });
    }

    async getTransactionFromBlock(blockId: string | number, txNumber: number): Promise<Transaction> {
        return new Promise((resolve, reject) => {
            this._eth.getTransactionFromBlock(blockId, txNumber, (err: Error, tx: Transaction) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tx);
            });
        });
    }

    async getTransactionReceipt(transactionHash: Bytes32): Promise<TransactionReceipt> {
        return new Promise((resolve, reject) => {
            this._eth.getTransactionReceipt(transactionHash, (err: Error, txReceipt: TransactionReceipt) => {
                if (err) {
                    return reject(err);
                }
                return resolve(txReceipt);
            });
        });
    }

    async getTransactionCount(address: Address, blockId?: BlockNumberParam): Promise<number> {
        return new Promise((resolve, reject) => {
            this._eth.getTransactionCount(address, blockId, (err: Error, txCount: number) => {
                if (err) {
                    return reject(err);
                }
                return resolve(txCount);
            });
        });
    }

    async sendTransaction(input: TxInput): Promise<Bytes32> {
        return new Promise((resolve, reject) => {
            this._eth.sendTransaction(input, (err: Error, txHash: Bytes32) => {
                if (err) {
                    return reject(err);
                }
                return resolve(txHash);
            });
        });
    }

    async sendRawTransaction(tx: Bytes): Promise<string> {
        return new Promise((resolve, reject) => {
            this._eth.sendTransaction(tx, (err, txHash) => {
                if (err) {
                    return reject(err);
                }
                return resolve(txHash);
            });
        });
    }

    async sign(address: Address, data: Bytes): Promise<Bytes> {
        return new Promise((resolve, reject) => {
            this._eth.sign(address, data, (err: Error, signed: string) => {
                if (err) {
                    return reject(err);
                }
                return resolve(signed);
            });
        });
    }

    async call(input: CallInput, blockId?: BlockNumberParam): Promise<Bytes> {
        return new Promise((resolve, reject) => {
            this._eth.call(input, blockId, (err, ret) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const bts: Bytes = toBytes(ret);
                        return resolve(bts);
                    } catch(err) {
                        return reject(err);
                    }
                }
            });
        });
    }

    async estimateGas(input: CallInput): Promise<number> {
        return new Promise((resolve, reject) => {
            this._eth.call(input, (err: Error, gas: number) => {
                if (err) {
                    return reject(err);
                }
                return resolve(gas);
            });
        });
    }

    filter(input: 'latest' | 'pending' | FilterParams): Filter {
        return this._eth.filter(input);
    }

    watch(input: 'latest' | 'pending' | FilterParams, cb: FilterWatchCallback): void {
        this._eth.filter(input, cb);
    }

    contract(abi: ABI): Contract {
        return this._eth.contract(abi);
    }

}

export default EthAPI;