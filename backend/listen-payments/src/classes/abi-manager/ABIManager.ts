import { ContractABI } from "src/types/abi.type";

class ABIManager {
    constructor(
        private abis: { [contractName: string]: ContractABI } = {}
    ) {
      this.abis = {};
    }
  
    addABI(contractName: string, abi: ContractABI) {
      this.abis[contractName] = abi;
    }
  
    getABI(contractName : string) {
      return this.abis[contractName];
    }
  }
  
export default ABIManager;