// @flow
import {isHexString, padLeft} from './hex'
import BigNumber from 'bignumber.js'
import type {Address} from "../types";

/**
 * Checks if a string is an address-string.
 *
 * @param {string} address - The value
 * @return {Boolean} True if it is an address string (40 byte hex string with '0x' in front).
 */
export function isAddressString(address: string): boolean {
    return isHexString(address) && address.length === 42 && address.substr(0, 2) === '0x';
}

/**
 * Transforms given string to valid 20 bytes-length address with 0x prefix
 *
 * @param {string} address - The non-formatted address (hex string with size <= 20 bytes).
 * @return {string} formatted address
 */
export function toAddress(address: string): string {
    if (!isHexString(address)) {
        throw new Error("'address' is not a hex string.");
    }
    let a = address;
    if (address.length >= 2 && address.substr(0, 2) === '0x')
        a = address.substr(2);
    if (address.length > 40)
        throw new Error("'address' is more then 20 bytes in size.");
    return padLeft(a, 20);
}

/**
 * Get the value of an address as a BigNumber.
 * Passing a non-valid value in as address will cause the function to throw.
 *
 * @param address
 * @returns BigNumber representation.
 */
export function addressValue(address: Address) {
    return new BigNumber(address.substr(2), 16);
}

/**
 * Check if two addresses are equal. This means their integer (BigNumber) values are the same.
 *
 * @param {Address} address1 - Address number one.
 * @param {Address} address2 - Address number two.
 * @returns {boolean} 'true' if they are both addresses, and their value is the same.
 */
export function addressesEquivalent(address1: Address, address2: Address): boolean {
    return addressValue(address1).eq(addressValue(address2));
}