class ABIManager {
    constructor(
        private abis: { [contractName: string]: any } = {}
    ) {
      this.abis = {};
    }
  
    addABI(contractName: string, abi: any) {
      this.abis[contractName] = abi;
    }
  
    getABI(contractName : string) {
      return this.abis[contractName];
    }
  }
  
export default ABIManager;