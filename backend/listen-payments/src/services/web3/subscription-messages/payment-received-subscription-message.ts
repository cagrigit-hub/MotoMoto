import envy from "../../../config/env";
import payment_abi from "../../web3/abi/payment-abi";
import EventTopicGenerator from "../../../classes/event-topic-generator";

const etg = new EventTopicGenerator(
    payment_abi
)

const eTopic = etg.getEventTopic("PaymentReceived");

const paymentReceivedSubscriptionMessage = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_subscribe",
    params: [
      "logs",
      {
        address: envy.PAYMENT_CONTRACT_ADDRESS,
        topics: [eTopic],
      },
    ],
  };

export default paymentReceivedSubscriptionMessage;