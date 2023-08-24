import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as cnf } from "dotenv";
import { resolve } from "path";
cnf({ path: resolve(__dirname, "./.env") });


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: {
      polygonTestnetScan: process.env.ETHERSCAN_API_KEY!,
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    polygonTestnet: {
      url: process.env.POLYGON_RPC!,
      accounts: [process.env.DEV_WALLET_PKEY!],
    }
  }
};

export default config;
