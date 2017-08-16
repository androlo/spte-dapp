// @flow
import {createWeb3} from '../../testutils/web3'
import {readContractBin, readContractABI} from "../../testutils/files";

let contract: any;

beforeAll(async () => {
    const w3 = await createWeb3();

    const bin = await readContractBin('UtilsSplitTests');
    const ABI = await readContractABI('UtilsSplitTests');
    const UtilsSplitTests = w3.eth.contract(ABI);

    return new Promise((resolve, reject) => {

        UtilsSplitTests.new({data: bin, gas: 3000000}, function (err, contract_) {
            if (err) {
                return reject(err);
            } else if (contract_.address) {
                contract = contract_;
                return resolve();
            }
        });
    });
});

test('splitAt - check that it fails when the position is higher then label length', done => {
    contract.testSplitAtFailPosGreaterThanLength((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(false);
        done();
    });
});


test('splitAt - check that it fails when the position is higher then the maximum 256', done => {
    contract.testSplitAtFailPosGreaterThan256((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(false);
        done();
    });
});

test('splitAt - check that it does not fail when the position is equal to the label length', done => {
    contract.testSplitAtPosEqualToLengthDoesntFail((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitAt - check that it does not fail when the position is equal to the maximum 256', done => {
    contract.testSplitAtPosEqualTo256DoesntFail((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitAt - ensure that function does not mutate the input', done => {
    contract.testSplitAtDoesntMutate((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitAt - check that a split at zero makes prefix equal to the null label, and suffix equal to the input label', done => {
    contract.testSplitAtZero((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitAt - test function with a variety of different input', done => {
    contract.testSplitAt((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitCommonPrefix - ensure that function does not mutate the input', done => {
    contract.testSplitCommonPrefixDoesNotMutate((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitCommonPrefix - check that a label splitting with itself makes prefix equal to the null label, and suffix equal to the input label', done => {
    contract.testSplitCommonPrefixWithItself((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitCommonPrefix - check that the null label splitting with a check label makes prefix equal to the null label, and suffix equal to the check label', done => {
    contract.testSplitCommonPrefixWithZeroLabel((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitCommonPrefix - check that a label splitting with the null label as check makes prefix equal to the null label, and suffix equal to the label', done => {
    contract.testSplitCommonPrefixWithZeroCheck((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('splitCommonPrefix - test function with a variety of different input', done => {
    contract.testSplitCommonPrefix((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});