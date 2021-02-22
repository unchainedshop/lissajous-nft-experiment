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
