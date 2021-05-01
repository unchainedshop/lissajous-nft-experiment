# Dev Quickstart

- Install and run [Ganache](https://www.trufflesuite.com/ganache) as dev chain. Expose Port 7545.
- Install [MetaMask](https://metamask.io) in your browser and [connect it to Ganache](http://blockchainsfalcon.com/using-ganache-ethereum-emulator-with-metamask/).

- Deploy the contracts on the dev-chain

```bash
cd contracts
npm install
npm run compile
npm run deploy
```

- Run the storefront:

```
cd storefront
npm install
npm run dev
```

- Point the MetaMask-enabled browser to: http://localhost:3000/

- Mint a token ;)

## Expected Rainbow Tokens:

| (index) | block    | date                     | timestamp     |
| ------- | -------- | ------------------------ | ------------- |
| 0       | 12373314 | 2021-05-05T08:21:16.657Z | 1620202876657 |
| 1       | 12374516 | 2021-05-05T12:45:55.077Z | 1620218755077 |
| 2       | 12399679 | 2021-05-09T09:05:58.307Z | 1620551158307 |
| 3       | 12426259 | 2021-05-13T10:38:00.107Z | 1620902280107 |
| 4       | 12444663 | 2021-05-16T06:09:56.947Z | 1621145396947 |
| 5       | 12466279 | 2021-05-19T13:29:04.307Z | 1621430944307 |
| 6       | 12470457 | 2021-05-20T04:48:55.687Z | 1621486135687 |
| 7       | 12476918 | 2021-05-21T04:31:25.497Z | 1621571485497 |
| 8       | 12484634 | 2021-05-22T08:50:13.857Z | 1621673413857 |
| 9       | 12488171 | 2021-05-22T21:48:57.627Z | 1621720137627 |
| 10      | 12501032 | 2021-05-24T21:00:31.437Z | 1621890031437 |
| 11      | 12532935 | 2021-05-29T18:04:30.067Z | 1622311470067 |
| 12      | 12540699 | 2021-05-30T22:33:52.507Z | 1622414032507 |
| 13      | 12565110 | 2021-06-03T16:08:21.817Z | 1622736501817 |
| 14      | 12567458 | 2021-06-04T00:45:18.897Z | 1622767518897 |
