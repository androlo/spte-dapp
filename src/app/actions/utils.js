import BigNumber from 'bignumber.js'
import type {Bytes32} from "../../web3/types";

export const hashToBin256 = (hash: Bytes32): string => {
    const bin = new BigNumber(hash.substr(2), 16).toString(2);
    return new Array(256 - bin.length + 1).join('0') + bin;
};

