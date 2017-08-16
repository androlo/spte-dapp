pragma solidity ^0.4.0;

import {D} from "./data.sol";
import {Utils} from "./utils.sol";

contract UtilsTestConstants {
    uint constant MAX_LENGTH = 256;
    uint constant UINT256_ZEROES = 0;
    uint constant UINT256_ONES = ~uint(0);
    bytes32 constant B32_ZEROES = bytes32(UINT256_ZEROES);
    bytes32 constant B32_ONES = bytes32(UINT256_ONES);
}

contract UtilsBitsTests is UtilsTestConstants {

    // should throw
    function testZeroBitsNotSet() constant returns (bool) {
        for (uint i = 0; i < 256; i++){
            require(Utils.bitSet(0, i) == 0);
        }
        return true;
    }

    function testOneBitsSet() constant returns (bool) {
        uint field = UINT256_ONES;
        for (uint i = 0; i < 256; i++){
            require(Utils.bitSet(field, i) == 1);
        }
        return true;
    }

    function testLowestBitSetFailBitFieldIsZero() constant returns (bool) {
        require(Utils.lowestBitSet(0) == 0);
        return true;
    }

    function testLowestBitSetSingleBit() constant returns (bool) {
        uint one = 1;
        for (uint i = 0; i < 256; i++){
            require(Utils.lowestBitSet(one << i) == i);
        }
        return true;
    }

    function testLowestBitSetAllHigherSet() constant returns (bool) {
        uint ones = UINT256_ONES;
        for (uint i = 0; i < 256; i++){
            require(Utils.lowestBitSet(ones << i) == i);
        }
        return true;
    }

}


contract UtilsPrefixTests is UtilsTestConstants {

    // should throw
    function testChopFirstBitFailLengthIsZero() constant returns (bool) {
        D.Label memory l;
        Utils.chopFirstBit(l);
        return true;
    }

    function testChopFirstBitZeroes() constant returns (bool) {
        D.Label memory l = D.Label(B32_ZEROES, 256);
        uint bit;
        for(uint i = 1; i <= 256; i++) {
            (bit, l) = Utils.chopFirstBit(l);
            require(bit == 0);
            require(l.data == B32_ZEROES);
            require(l.length == MAX_LENGTH - i);
        }
        return true;
    }

    function testChopFirstBitOnes() constant returns (bool) {
        D.Label memory l = D.Label(B32_ONES, 256);
        uint bit;
        for(uint i = 1; i <= 256; i++) {
            (bit, l) = Utils.chopFirstBit(l);
            require(bit == 1);
            require(l.data == B32_ONES << i);
            require(l.length == MAX_LENGTH - i);
        }
        return true;
    }

    function testChopFirstBitDoesNotMutate() constant returns (bool) {
        D.Label memory l = D.Label(B32_ONES, 256);
        Utils.chopFirstBit(l);
        require(l.data == B32_ONES);
        require(l.length == 256);
        return true;
    }

    // should throw
    function testRemovePrefixFailLessLengthZero() constant returns (bool) {
        D.Label memory l;
        Utils.removePrefix(l, 1);
        return true;
    }

    // should throw
    function testRemovePrefixFailLessLengthNonZero() constant returns (bool) {
        D.Label memory l = D.Label(B32_ZEROES, 5);
        Utils.removePrefix(l, 6);
        return true;
    }

    function testRemoveZeroPrefixLengthZero() constant returns (bool) {
        D.Label memory l = D.Label(B32_ONES, 0);
        l = Utils.removePrefix(l, 0);
        require(l.data == B32_ONES);
        require(l.length == 0);
        return true;
    }

    function testRemoveZeroPrefixLength256() constant returns (bool) {
        D.Label memory l = D.Label(B32_ONES, 256);
        l = Utils.removePrefix(l, 0);
        require(l.data == B32_ONES);
        require(l.length == 256);
        return true;
    }

    function testRemoveFullPrefixLength256() constant returns (bool) {
        D.Label memory l = D.Label(B32_ONES, 256);
        l = Utils.removePrefix(l, 256);
        require(l.data == B32_ZEROES);
        require(l.length == 0);
        return true;
    }

    function testRemovePrefix() constant returns (bool) {
        D.Label memory l = D.Label(hex"ef1230", 20);
        l = Utils.removePrefix(l, 4);
        require(l.length == 16);
        require(l.data == hex"f123");
        l = Utils.removePrefix(l, 15);
        require(l.length == 1);
        require(l.data == hex"80");
        l = Utils.removePrefix(l, 1);
        require(l.length == 0);
        require(l.data == 0);
        return true;
    }

    function testRemovePrefixOnes() constant returns (bool) {
        D.Label memory l = D.Label(B32_ONES, 256);
        for(uint i = 1; i <= 256; i++) {
            l = Utils.removePrefix(l, 1);
            require(l.data == B32_ONES << i);
            require(l.length == MAX_LENGTH - i);
        }
        return true;
    }

    function testRemovePrefixDoesNotMutate() constant returns (bool) {
        D.Label memory l = D.Label(hex"ef1230", 20);
        Utils.removePrefix(l, 4);
        require(l.data == hex"ef1230");
        require(l.length == 20);
        return true;
    }

    function testCommonPrefixOfZeroLengthLabelsIsZero() constant returns (bool) {
        D.Label memory a;
        D.Label memory b;
        require(Utils.commonPrefix(a, b) == 0);
        return true;
    }

    function testCommonPrefixOfNonZeroAndZeroLabelIsZero() constant returns (bool) {
        D.Label memory a = D.Label(B32_ONES, 256);
        D.Label memory b;
        require(Utils.commonPrefix(a, b) == 0);
        return true;
    }

    function testCommonPrefixOfLabelWithItselfIsLabelLength() constant returns (bool) {
        D.Label memory a = D.Label(B32_ONES, 164);
        require(Utils.commonPrefix(a, a) == 164);
        return true;
    }

    function testCommonPrefixIsCommutative() constant returns (bool) {
        D.Label memory a = D.Label(hex"bbcd", 16);
        D.Label memory b = D.Label(hex"bb00", 16);
        require(Utils.commonPrefix(a, b) == Utils.commonPrefix(b, a));
        return true;
    }

    function testCommonPrefixDoesNotMutate() constant returns (bool) {
        D.Label memory a = D.Label(hex"bbcd", 16);
        D.Label memory b = D.Label(hex"bb00", 16);
        Utils.commonPrefix(a, b);
        require(a.data == hex"bbcd");
        require(a.length == 16);
        require(b.data == hex"bb00");
        require(b.length == 16);
        return true;
    }

    function testCommonPrefixLengthsLessThanGreaterThanAndEqual() constant returns (bool) {
        D.Label memory a = D.Label(hex"bb0031", 24);
        D.Label memory b = D.Label(hex"bbcd", 16);
        require(Utils.commonPrefix(a, b) == 8);
        require(Utils.commonPrefix(b, a) == 8);
        a = D.Label(hex"bb00", 16);
        require(Utils.commonPrefix(a, b) == 8);
        return true;
    }

    function testCommonPrefix() constant returns (bool) {
        D.Label memory a;
        D.Label memory b;
        a.data = hex"abcd";
        a.length = 16;
        b.data = hex"a000";
        b.length = 16;
        require(Utils.commonPrefix(a, b) == 4);

        b.length = 0;
        require(Utils.commonPrefix(a, b) == 0);

        b.data = hex"bbcd";
        b.length = 16;
        require(Utils.commonPrefix(a, b) == 3);
        require(Utils.commonPrefix(b, b) == b.length);
        return true;
    }

}


contract UtilsSplitTests is UtilsTestConstants {

    // Should throw
    function testSplitAtFailPosGreaterThanLength() constant returns (bool) {
        D.Label memory l = D.Label(B32_ZEROES, 0);
        Utils.splitAt(l, 1);
        return true;
    }

    // Should throw
    function testSplitAtFailPosGreaterThan256() constant returns (bool) {
        D.Label memory l = D.Label(B32_ZEROES, 0);
        Utils.splitAt(l, 257);
        return true;
    }

    function testSplitAtPosEqualToLengthDoesntFail() constant returns (bool) {
        D.Label memory l = D.Label(B32_ZEROES, 2);
        Utils.splitAt(l, 2);
        return true;
    }

    function testSplitAtPosEqualTo256DoesntFail() constant returns (bool) {
        D.Label memory l = D.Label(B32_ZEROES, 256);
        Utils.splitAt(l, 256);
        return true;
    }

    function testSplitAtDoesntMutate() constant returns (bool) {
        D.Label memory l = D.Label(B32_ONES, 55);
        Utils.splitAt(l, 43);
        require(l.data == B32_ONES);
        require(l.length == 55);
        return true;
    }

    function testSplitAtZero() constant returns (bool) {
        D.Label memory l = D.Label(B32_ONES, 55);
        var (pre, suf) = Utils.splitAt(l, 0);
        require(pre.data == B32_ZEROES);
        require(pre.length == 0);
        require(suf.data == B32_ONES);
        require(suf.length == 55);
        return true;
    }

    function testSplitAt() constant returns (bool) {
        D.Label memory a = D.Label(hex"abcd", 16);

        var (x, y) = Utils.splitAt(a, 0);
        require(x.length == 0);
        require(y.length == a.length);
        require(y.data == a.data);

        (x, y) = Utils.splitAt(a, 4);
        require(x.length == 4);
        require(x.data == hex"a0");
        require(y.length == 12);
        require(y.data == hex"bcd0");

        (x, y) = Utils.splitAt(a, 16);
        require(y.length == 0);
        require(x.length == a.length);
        require(x.data == a.data);

        return true;
    }

    function testSplitCommonPrefixDoesNotMutate() constant returns (bool) {
        D.Label memory a = D.Label(hex"abcd", 16);
        D.Label memory b = D.Label(hex"a0f570", 20);
        Utils.splitCommonPrefix(a, b);

        require(a.data == hex"abcd");
        require(a.length == 16);
        require(b.data == hex"a0f570");
        require(b.length == 20);

        return true;
    }

    function testSplitCommonPrefixWithItself() constant returns (bool) {
        D.Label memory a = D.Label(hex"abcd", 16);
        var (pre, suf) = Utils.splitCommonPrefix(a, a);
        require(pre.data == a.data);
        require(pre.length == a.length);

        require(suf.data == B32_ZEROES);
        require(suf.length == 0);

        return true;
    }

    function testSplitCommonPrefixWithZeroLabel() constant returns (bool) {
        D.Label memory a = D.Label(B32_ZEROES, 0);
        D.Label memory b = D.Label(hex"a0f570", 20);
        var (pre, suf) = Utils.splitCommonPrefix(a, b);

        require(pre.data == B32_ZEROES);
        require(pre.length == 0);
        require(suf.data == a.data);
        require(suf.length == a.length);

        return true;
    }

    function testSplitCommonPrefixWithZeroCheck() constant returns (bool) {
        D.Label memory a = D.Label(B32_ZEROES, 0);
        D.Label memory b = D.Label(hex"a0f570", 20);
        var (pre, suf) = Utils.splitCommonPrefix(b, a);

        require(pre.data == B32_ZEROES);
        require(pre.length == 0);
        require(suf.data == b.data);
        require(suf.length == b.length);

        return true;
    }

    function testSplitCommonPrefix() constant returns (bool) {
        D.Label memory a = D.Label(hex"abcd", 16);
        D.Label memory b = D.Label(hex"a0f570", 20);

        var (prefix, suffix) = Utils.splitCommonPrefix(b, a);
        require(prefix.length == 4);
        require(prefix.data == hex"a0");
        require(suffix.length == 16);
        require(suffix.data == hex"0f57");

        return true;
    }
}