import { ABIExtractor } from "@cakitomakito/extract_abi";
import { ContractABI } from "src/types/abi.type";

const abi_extractor = new ABIExtractor(
  "/Users/kutay/Desktop/Builds/projects/moto-moto/backend/builded_contracts",
  "artifacts"
);


const payment_abi = abi_extractor.getABI("Payment") as ContractABI;

export default payment_abi;