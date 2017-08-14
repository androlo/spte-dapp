// @flow
import BigNumber from 'bignumber.js'
import type { AnyNumber } from 'bignumber.js'

import {toAddress as toAddr} from './utils/address'
import {isStrictHexBytesString, padRight} from "./utils/hex"

// TODO make opaque when that starts working...

export type Address = string
export type Bytes32 = string
export type Bytes = string

export type Contract = any

export type SyncData = {
    startingBlock: number,
    currentBlock: number,
    highestBlock: number
}

export type SyncObject = {
    addCallback: (SyncCallback) => Promise<>,
    stopWatching: () => void
}

export type SyncCallback = (err: Error, SyncData | boolean) => Promise<>;

export type Transaction = {
    hash: string,
    nonce: number,
    blockHash: ?string,
    blockNumber: ?number,
    transactionIndex: ?number;
    from: string,
    to: ?string,
    value: BigNumber,
    gasPrice: BigNumber,
    gas: number,
    input: string
}

export type BlockNumberParam = number | 'earliest' | 'pending' | 'latest';

export type Block = {
    number: ?number,
    hash: ?string,
    parentHash: string,
    nonce: ?string,
    logsBloom: ?string,
    transactionsRoot: string,
    stateRoot: string,
    miner: string,
    difficulty: number,
    totalDifficulty: BigNumber,
    extraData: string,
    size: number,
    gasLimit: number,
    gasUsed: number,
    timestamp: number,
    transactions: string[] | Transaction[],
    uncles: string[]
}

export type LogEntry = {
    logIndex: ?number,
    transactionIndex: ?number,
    transactionHash: ?string,
    blockHash: ?string,
    blockNumber: ?number,
    address: string,
    data: string,
    topics: string[],
}

export type TransactionReceipt = {
    blockHash: string,
    blockNumber: number,
    transactionHash: string,
    transactionIndex: number,
    from: string,
    to: ?string,
    cumulativeGasUsed: number,
    gasUsed: number,
    contractAddress: ?string,
    logs: LogEntry[]
}

export type TxInput = {
    from: string,
    to: ?string,
    value: ?AnyNumber,
    gas: ?AnyNumber,
    gasPrice: ?AnyNumber,
    data: ?string,
    nonce: ?number
}

export type CallInput = {
    from: ?string,
    to: ?string,
    value: ?AnyNumber,
    gas: ?AnyNumber,
    gasPrice: ?AnyNumber,
    data: ?string,
    nonce: ?number
}

export type Topic = null | string | string[]

export type FilterBlockParam = number | 'latest' | 'pending'

export type FilterParams = {
    fromBlock: FilterBlockParam,
    toBlock: FilterBlockParam,
    address: string,
    topics?: Topic[]
}

export type FilterWatchCallback = (Error, LogEntry | string) => Promise<void>

export type FilterGetCallback = (Error, LogEntry[] | string) => Promise<void>

export type Filter = {
    get: (FilterGetCallback) => void;
    watch: (FilterWatchCallback) => void;
    stopWatching: () => void;
}

export function toAddress(str: string): Address {
    return (toAddr(str): Address);
}

export function toBytes32(str: string): Bytes32 {
    return (padRight(str, 32): Bytes32);
}

export function toBytes(str: string): Bytes {
    if (isStrictHexBytesString(str)) {
        throw new Error(`String is not a hex represntation of bytes: ${str}`);
    }
    return (str: Bytes);
}