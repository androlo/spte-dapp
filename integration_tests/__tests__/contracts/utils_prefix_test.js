// @flow
import {createWeb3} from '../../testutils/web3'
import {readContractBin, readContractABI} from "../../testutils/files";

let contract: any;

beforeAll(async () => {
    const w3 = await createWeb3();

    const bin = await readContractBin('UtilsPrefixTests');
    const ABI = await readContractABI('UtilsPrefixTests');
    const UtilsPrefixTests = w3.eth.contract(ABI);

    return new Promise((resolve, reject) => {

        UtilsPrefixTests.new({data: bin, gas: 3000000}, function (err, contract_) {
            if (err) {
                return reject(err);
            } else if (contract_.address) {
                contract = contract_;
                return resolve();
            }
        });
    });
});

test('chopFirstBit - check that function throws if the provided length is zero', done => {
    contract.testChopFirstBitFailLengthIsZero((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(false);
        done();
    });
});

test('chopFirstBit - test cutting all bits off an all-zero bitfield sequentially', done => {
    contract.testChopFirstBitZeroes((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('chopFirstBit - test cutting all bits off an all-one bitfield sequentially', done => {
    contract.testChopFirstBitOnes((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('chopFirstBit - check that function does not mutate the input', done => {
    contract.testChopFirstBitDoesNotMutate((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('removePrefix - ensure that function fails if the length of the provided label is 0 and prefix length 1', done => {
    contract.testRemovePrefixFailLessLengthZero((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(false);
        done();
    });
});

test('removePrefix - ensure that function fails if the length of the provided label is 5 and prefix length 6', done => {
    contract.testRemovePrefixFailLessLengthNonZero((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(false);
        done();
    });
});

test('removePrefix - check that removing prefix of length 0 of a label with length 0 does not change the label', done => {
    contract.testRemoveZeroPrefixLengthZero((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('removePrefix - check that removing prefix of length 0 of a label with length 256 does not change the label', done => {
    contract.testRemoveZeroPrefixLength256((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('removePrefix - check that removing prefix of length 256 of a label with length 256 makes data and length null', done => {
    contract.testRemoveFullPrefixLength256((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});


test('removePrefix - check that removing prefixes of various size data and labels, and prefix lengths, works', done => {
    contract.testRemovePrefix((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});


test('removePrefix - check that removing a prefix of length 1 until length is 0 works', done => {
    contract.testRemovePrefixOnes((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('removePrefix - check that function does not mutate the input', done => {
    contract.testRemovePrefixDoesNotMutate((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('commonPrefix - check that the common prefix of two labels with length zero is zero', done => {
    contract.testCommonPrefixOfZeroLengthLabelsIsZero((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('commonPrefix - check that the common prefix of one label with length zero and one with a non-zero length is zero', done => {
    contract.testCommonPrefixOfNonZeroAndZeroLabelIsZero((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('commonPrefix - check that the common prefix of one label with itself is the length of the label', done => {
    contract.testCommonPrefixOfLabelWithItselfIsLabelLength((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('commonPrefix - check that the function is commutative', done => {
    contract.testCommonPrefixIsCommutative((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('commonPrefix - check that the function does not mutate its input', done => {
    contract.testCommonPrefixDoesNotMutate((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('commonPrefix - check that the function works for equal and un-equal lengths (regardless of which label is longer)', done => {
    contract.testCommonPrefixLengthsLessThanGreaterThanAndEqual((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});

test('commonPrefix - check a number of different combinations of label data and lengths', done => {
    contract.testCommonPrefix((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        done();
    });
});