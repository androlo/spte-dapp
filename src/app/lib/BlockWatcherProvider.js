// @flow
import Web3Provider from './Web3Provider'
import EthAPI from '../../web3/EthAPI';
import type {Block, Filter} from '../../web3/types'
import uuid from 'uuid';

type BlockCallback = (?Error, ?Block) => void;

let _blockWatcher: ?BlockWatcher;

export class BlockWatcher {
    _eth: EthAPI;
    _filter: Filter;
    _blockListeners: Map<string, BlockCallback>;

    constructor(eth: EthAPI) {
        this._eth = eth;
        this._filter = eth.filter('latest');
        this._blockListeners = new Map();
    }

    start(): void {
        const that = this;
        this._filter.watch(async function (err, blockHash) {
            if (that._blockListeners.size === 0) {
                return;
            }
            if (err) {
                that._dispatchBlock(err, null);
                return;
            }
            if (typeof blockHash === 'string') {
                try {
                    const block = await that._eth.getBlock(blockHash);
                    that._dispatchBlock(null, block);

                } catch (err) {
                    this.emit('block', err);
                    this.emit('transactions', err);
                }
            }

        });
    }

    stop(): void {
        this._filter.stopWatching();
    }

    addBlockListener(cb: BlockCallback): string {
        let id = uuid.v1();
        this._blockListeners.set(id, cb);
        return id;
    }

    removeBlockListener(id: string): boolean {
        return this._blockListeners.delete(id);
    }

    _dispatchBlock(err: ?Error, block: ?Block) {
        for (let fun of this._blockListeners.values()) {
            fun(err, block);
        }
    }

}

class BlockWatcherProvider {

    static init(): BlockWatcher {
        if (_blockWatcher) {
            throw new Error("block-watcher has already been initialized.");
        }
        _blockWatcher = new BlockWatcher(Web3Provider.web3().eth);
        _blockWatcher.start();
        return _blockWatcher;
    }

    static blockWatcher(): BlockWatcher {
        if (!_blockWatcher) {
            throw new Error("block-watcher has not been initialized.");
        }
        return _blockWatcher;
    }
}

export default BlockWatcherProvider;
