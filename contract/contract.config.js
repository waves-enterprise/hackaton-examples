module.exports = {
  image: "log-contract",
  name: 'Your Contract Name',
  version: '0.0.1', // default=latest
  networks: {
    testnet: {
      seed: '#paste your seed phrase here',
    },

    mainnet: {
      seed: '#paste your seed phrase here'
    },
    sandbox: {
      registry: 'localhost:5001',
      nodeAddress: 'http://localhost:6862',
      seed: 'slam about victory still chief attack accuse giggle tone rabbit prefer inner process shrug item',
      params: {
        init: () => ({})
      }
    }
  }
}