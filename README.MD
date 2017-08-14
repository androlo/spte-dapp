### Usage

1. Make sure you're running a (private) development chain that answers to RPC requests on port 8545, and has cors "*" set (geth), or "all" (parity).
2. Make sure it has an unlocked account at eth.accounts[0].
3. Make sure that account has enough Ether to pay for gas.
4. Make sure to allow http to run, even though it defaults to https (this may force you to allow "dangerous" scripts - which essentially means it calls a regular http endpoint ie the blockchain node on your local machine).
5. Deploy contract, insert elements, watch it go.