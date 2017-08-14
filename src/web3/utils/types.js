// @flow
import type {Bytes32} from "../types"
import {asciiToHex, utf8ToHex} from './hex'
import {toBytes32} from "../types"

export function asciiToBytes32(str: string): Bytes32 {
    return toBytes32(asciiToHex(str, 32));
}

export function utf8ToBytes32(str: string): Bytes32 {
    return toBytes32(utf8ToHex(str, 32));
}