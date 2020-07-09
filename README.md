# Aragon China

To deploy a China DAO to xDAI:

1) Install dependencies:
```
$ npm install
```

2) Compile contracts:
```
$ npx truffle compile
```

3) Configure your DAO in: `scripts/new-dao.js`

4) Deploy a DAO to Rinkeby (requires a Rinkeby account accessible by the truffle script as documented here:
https://hack.aragon.org/docs/cli-intro#set-a-private-key):
```
$ npx truffle exec scripts/new-dao.js --network xdai
```

5) Copy the output DAO address into this URL and open it in a web browser:
```
https://aragon.1hive.org/#/<DAO_ADDRESS>
```
