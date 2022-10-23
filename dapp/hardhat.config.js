require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");


module.exports = {
  solidity: {
    version : "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999,
      },
    },
  },
  networks:{
    // mainnet: {
    //   url: process.env.ALCHEMY_API_KEY_URL,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    goerli:{
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
    etherscan: {
      apiKey:process.env.ETHERSCAN_API_KEY,
    }
};