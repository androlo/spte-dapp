// @flow
import {createWeb3} from '../../testutils/web3'
import {readContractBin, readContractABI} from "../../testutils/files";

let contract: any;

beforeAll(async () => {
    const w3 = await createWeb3();

    const bin = await readContractBin('UtilsBitsTests');
    const ABI = await readContractABI('UtilsBitsTests');
    const UtilsBitTests = w3.eth.contract(ABI);

    return new Promise((resolve, reject) => {

        UtilsBitTests.new({data: bin, gas: 3000000}, function (err, contract_) {
            if (err) {
                return reject(err);
            } else if (contract_.address) {
                contract = contract_;
                return resolve();
            }
        });
    });
});

test('bitSet - check that zero bits are not considered set', done => {
    contract.testZeroBitsNotSet((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('bitSet - check that one bits are considered set', done => {
    contract.testOneBitsSet((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('lowestBitSet - ensure that the function throws when bitfield = 0', done => {
    contract.testLowestBitSetFailBitFieldIsZero((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(false);
        done();
    });
});

test('lowestBitSet - check that a single bit is always the lowest bit set', done => {
    contract.testLowestBitSetSingleBit((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('lowestBitSet - check that higher order bits does not interfere', done => {
    contract.testLowestBitSetAllHigherSet((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});