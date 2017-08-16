### Usage

1. Make sure you're running a (private) development chain that answers to RPC requests on port 8545, and has cors "*" set (geth), or "all" (parity).
2. Make sure it has an unlocked account at eth.accounts[0].
3. Make sure that account has enough Ether to pay for gas.
4. Make sure to allow http to run, even though it defaults to https (this may force you to allow "dangerous" scripts - which essentially means it calls a regular http endpoint ie the blockchain node on your local machine).
5. Deploy contract, insert elements, watch it go.

Don't do anything with this code. There are no unit tests, and no docs yet. Also 'flow' will fail, and keep failing until an issue with opaque types has been fixed (next version most likely).

This repo will be moved to a permanent place when everything is in order.

To run integration tests (contract tests):

1. You need to have a functioning eth node up, as per the instructions above.
2. You also need to make sure you ran the `compile.sh` script in the contracts folder first, and end up with compiled contracts in the `build` sub-folder. This requires you have `solc` in your PATH.
3. You must make sure `npm install` has been run.
4. `npm test`