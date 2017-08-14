import {combineReducers} from 'redux'
import ethereum from './ethereum'
import deploy from './deploy';
import insert from './insert'
import trie from './trie';
import trieSelection from './trieSelection'
import getProof from './getProof'
import keccak256 from './keccak256'

export default combineReducers({
    ethereum,
    deploy,
    insert,
    trie,
    trieSelection,
    getProof,
    keccak256
})