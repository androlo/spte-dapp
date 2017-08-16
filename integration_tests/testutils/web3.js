import Web3 from 'web3';
import Web3Provider from "../../src/app/lib/Web3Provider";
import Web3Wrapper from "../../src/web3/Web3";

export const createWeb3 = async (): Web3Wrapper => {
    return new Promise((resolve, reject) => {
        let w3 = new Web3();
        try {
            w3.setProvider(new w3.providers.HttpProvider("http://localhost:8545"));
        } catch (err) {
            return reject(err);
        }
        w3.eth.getAccounts((err, accounts) => {
            if (!err) {
                w3.eth.defaultAccount = accounts[0];
                const w3wrapper = Web3Provider.init(w3);
                return resolve(w3wrapper);
            } else {
                return reject(err);
            }
        });
    });
};