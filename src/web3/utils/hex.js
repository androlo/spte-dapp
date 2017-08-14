// @flow
import utf8 from 'utf8'
import BigNumber from 'bignumber.js'

const hexRX = /^(0x)?[0-9a-fA-F]*$/i;
const strictHexRX = /^0x[0-9a-fA-F]*$/i;
const hexBytesRX = /^(0x)?([0-9a-fA-F]{2})*$/i;
const strictHexBytesRX = /^0x([0-9a-fA-F]{2})*$/i;

const ZERO = new BigNumber(0);

/**
 * Is the variable a hex string (with or without '0x' in front).
 *
 * @param {string} str The value.
 * @returns {boolean} 'true' if the value matches the hex pattern (/^(0x)?[0-9a-fA-F]*$/i). 'false' otherwise.
 */
export function isHexString(str: string): boolean {
    return hexRX.test(str);
}

/**
 * Is the variable a hex string (with '0x' in front).
 *
 * @param {string} str The string.
 * @returns {boolean} 'true' if the value matches the strict hex pattern (/^0x[0-9a-fA-F]*$/i). 'false' otherwise.
 */
export function isStrictHexString(str: string): boolean {
    return strictHexRX.test(str);
}

/**
 * Is the variable a hex string representing a byte-array (even length with or without '0x' in front).
 *
 * @param {string} str The value.
 * @returns {boolean} 'true' if the value matches the hex pattern (/^(0x)?([0-9a-fA-F]{2])*$/i). 'false' otherwise.
 */
export function isHexBytesString(str: string): boolean {
    return hexBytesRX.test(str);
}

/**
 * Is the variable a hex string representing a byte-array (even length with '0x' in front)
 *
 * @param {string} str The string.
 * @returns {boolean} 'true' if the value matches the strict hex pattern (/^0x([0-9a-fA-F]{2})*$/i). 'false' otherwise.
 */
export function isStrictHexBytesString(str: string): boolean {
    return strictHexRX.test(str);
}

/**
 * Is the input value a hex string equivalent to null. Valid null strings are
 * '0x', '' (the empty string), and anything that stands for 0, e.g.
 * '0x0', '0x00', '0', '0000000', '0x0000000000000000000000000000000000', etc.
 *
 * @param {string} str - The supposed hex string.
 * @returns {boolean} 'true' if the string is a valid hex representation of null.
 */
export function isNull(str: string): boolean {
    if (!isHexString(str))
        return false;
    if (str === '' || (str.length >= 2 && str === '0x'))
        return true;
    return new BigNumber(str, 16).eq(ZERO);
}

/**
 * Left-pad a hex-string with zeroes.
 *
 * @param {string} hex - The presumed hex-string.
 * @param {number} totalBytes - The total amount of bytes that the hex string should have. If lower then the
 * original hex string then an error will be thrown.
 * @returns {string} The padded string.
 */
export function padLeft(hex: string, totalBytes: number) {
    if (!isHexString(hex))
        throw new Error('Input is not valid hex.');
    return _padLeft(hex, totalBytes);
}

/**
 * Left-pad a bytes (even length) hex-string with zeroes.
 *
 * @param {string} hex - The presumed hex-string.
 * @param {number} totalBytes - The total amount of bytes that the hex string should have. If lower then the
 * original hex string then an error will be thrown.
 * @returns {string} The padded string.
 */
export function padBytesLeft(hex: string, totalBytes: number) {
    if (!isHexBytesString(hex))
        throw new Error('Input is not valid hex.');
    return _padLeft(hex, totalBytes);
}

function _padLeft(hex: string, totalBytes: number): string {
    if (hex.length >= 2 && hex.substr(0, 2) === '0x')
        hex = hex.substr(2);
    const aLen = 2 * totalBytes - hex.length;
    if (aLen < 0)
        throw new Error('totalBytes too small - padded version would truncate the original string.');
    return `0x${new Array(aLen + 1).join('0')}${hex}`;
}

/**
 * Right-pad a hex-string with zeroes.
 *
 * @param {string} hex - The presumed hex-string.
 * @param {number} totalBytes - The total amount of bytes that the hex string should have. If lower then the
 * original hex string then an error will be thrown.
 * @returns {string} The padded string.
 */
export function padRight(hex: string, totalBytes: number) {
    if (!isHexString(hex))
        throw new Error('Input is not valid hex.');
    return _padRight(hex, totalBytes);
}

/**
 * Left-pad a bytes (even length) hex-string with zeroes.
 *
 * @param {string} hex - The presumed hex-string.
 * @param {number} totalBytes - The total amount of bytes that the hex string should have. If lower then the
 * original hex string then an error will be thrown.
 * @returns {string} The padded string.
 */
export function padBytesRight(hex: string, totalBytes: number) {
    if (!isHexBytesString(hex))
        throw new Error('Input is not valid hex.');
    return _padRight(hex, totalBytes);
}

function _padRight(hex: string, totalBytes: number): string {
    if (hex.length >= 2 && hex.substr(0, 2) === '0x')
        totalBytes += 1; // Just so that 2 more '0's are added.
    const aLen = 2 * totalBytes - hex.length;
    if (aLen < 0)
        throw new Error('totalBytes too small - padded version would truncate the original string.');
    return hex + new Array(aLen + 1).join('0');
}

/**
 * Should be called to get ascii from it's hex representation.
 *
 * @param {string} hex - string in hex
 * @returns {string} ascii string representation of hex value
 */
export function hexToAscii(hex: string): string {

    if (!isHexBytesString(hex)) {
        throw new Error('Input is not valid hex of even length.');
    }
    if (hex.length === 0) {
        return '';
    }
    let hex_ = hex;
    if (hex_.slice(0, 2) === '0x') {
        hex_ = hex_.slice(2);
        if (hex_.length === 0) {
            return '';
        }
    }
    let str = '';
    let i = 0, l = hex_.length;
    if (hex_.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i += 2) {
        const code = parseInt(hex_.substr(i, 2), 16);
        if (code === 0) {
            break;
        }
        if (code > 127) {
            throw new Error(`Invalid ascii character code found: ${code}`);
        }
        str += String.fromCharCode(code);
    }
    return str;
}

/**
 * Should be called to get the hex representation (prefixed by 0x) of an ascii string.
 * The resulting hex-string can be right padded with '00' entries to ensure that
 * it reaches a certain length. This is done through the optional 'totalBytes' param.
 *
 * @param {string} str - The ascii string.
 * @param {number} [totalBytes] - The total amount of bytes that the hex string should have.
 * @returns {string} hex representation of input string
 */
export function asciiToHex(str: string, totalBytes?: number): string {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code > 127) {
            throw new Error(`Invalid ascii character found: ${str[i]}`);
        }
        const n = code.toString(16);
        hex += n.length < 2 ? `0${n}` : n;
    }
    if (totalBytes) {
        hex += (new Array(2 * totalBytes - hex.length + 1).join('0'));
    }
    return `0x${hex}`;
}

/**
 * Should be called to get utf8 from it's hex representation
 *
 * @param {string} hex - string in hex
 * @returns {string} ascii string representation of hex value
 */
export function hexToUtf8(hex: string): string {
    if (!isHexBytesString(hex)) {
        throw new Error('Input is not valid hex of even length.');
    }
    if (hex.length === 0) {
        return '';
    }
    let hex_ = hex;
    if (hex_.slice(0, 2) === '0x'){
        hex_ = hex_.slice(2);
    }
    let str = '';
    let i = 0, l = hex_.length;
    if (hex_.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i += 2) {
        const code = parseInt(hex_.substr(i, 2), 16);
        if (code === 0) {
            break;
        }
        str += String.fromCharCode(code);
    }
    return utf8.decode(str);
}

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 * The resulting hex-string can be right padded with '00' entries to ensure that
 * it reaches a certain length. This is done through the optional 'totalBytes' param.
 *
 * @param {string} str - The utf string.
 * @param {number} [totalBytes] - The total amount of bytes that the hex string should have.
 * @returns {string} hex representation of input string
 */
export function utf8ToHex(str: string, totalBytes?: number) {
    str = utf8.encode(str);
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code === 0) {
            break;
        }
        const n = code.toString(16);
        hex += n.length < 2 ? `0${n}` : n;
    }
    if (totalBytes) {
        hex += (new Array(2 * totalBytes - hex.length + 1).join('0'));
    }
    return `0x${hex}`;
}