// @flow
import fs from 'fs'
import path from 'path';

export const CONTRACT_PATH = path.join(__dirname, '..', '..', 'contracts', 'build');

export const read = async (path: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString());
            }
        })
    })
};

export const readJSON = async (path: string): Promise<any[]> => {
    return read(path).then(data => JSON.parse(data.toString()));
};

export const readContractBin = async (name: string): Promise<string> => {
    return read(path.join(CONTRACT_PATH, name + ".bin")).then(data => '0x' + data);
};

export const readContractABI = async (name: string): Promise<string> => {
    return readJSON(path.join(CONTRACT_PATH, name + ".abi"));
};