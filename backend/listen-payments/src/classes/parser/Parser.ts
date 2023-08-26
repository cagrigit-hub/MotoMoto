import type { Log } from "src/types/Log.type";
import { ContractABI } from "src/types/abi.type";

class Parser {
    contractABI : ContractABI;

    constructor(contractABI : ContractABI) {
        this.contractABI = contractABI;
    }
    parseEventLog(log: Log): any {
        const eventSignature = log.topics[0];
    }

    decodeData(data: string): any {
        let decoded = []
        for (let i = 2; i < data.length; i += 64) {
            decoded.push("0x" + data.slice(i, i + 64));
        }

    }
}