import WebSocket from "ws";
import { createHash } from "crypto";

const socket = new WebSocket("ws://localhost:8080");
import { ABIExtractor } from "@cakitomakito/extract_abi";

const abi_extractor = new ABIExtractor(
  "/Users/kutay/Desktop/Builds/projects/moto-moto/backend/builded_contracts",
  "artifacts"
);

const contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contract_abi = abi_extractor.getABI("Payment");

// from contract_abi get PaymentReceived event topic
const eventAbi = contract_abi.find((e: any) => e.name === "PaymentReceived");
const eventSignature = `${eventAbi.name}(${eventAbi.inputs
  .map((i: any) => i.type)
  .join(",")})`;
const eventTopic =
  "0x" + createHash("sha256").update(eventSignature).digest("hex");

// Subscribe to the PaymentReceived event of the contract
const subscriptionMessage = {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_subscribe",
  params: [
    "logs",
    {
      address: contract_address,
      topics: [eventTopic],
    },
  ],
};

socket.on("open", () => {
  socket.send(JSON.stringify(subscriptionMessage));
});

socket.on("message", (message) => {
  console.log(message)
});
