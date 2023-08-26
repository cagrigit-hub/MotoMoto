import { ABIExtractor } from "@cakitomakito/extract_abi";

const abi_extractor = new ABIExtractor(
  "/Users/kutay/Desktop/Builds/projects/moto-moto/backend/builded_contracts",
  "artifacts"
);


const payment_abi = abi_extractor.getABI("Payment");

export default payment_abi;