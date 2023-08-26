import socket from "./services/socket/socket";
import g_subscriptionManager from "./services/global-managers/sub-message-manager";

const PaymentReceivedsubscriptionMessage =
  g_subscriptionManager.getMessage("paymentReceived");

let subscriptionId = 0;
socket.on("open", () => {
  socket.send(JSON.stringify(PaymentReceivedsubscriptionMessage));
  console.log("WebSocket connection established");
  keepAliveInterval = setInterval(() => {
    console.log("Checking if the connection is alive, sending a ping");
    // ping
    socket?.emit("ping");
    pingTimeout = setTimeout(() => {
      socket?.close();
    }, EXPECTED_PONG_BACK);
  }, KEEP_ALIVE_CHECK_INTERVAL);
});

socket.on("message", (message) => {
  // parse the message
  const parsedMessage = JSON.parse(message.toString());
  // check if it is a subscription confirmation
  if (parsedMessage.id === 1) {
    console.log("Subscription confirmed");

    return;
  }
  // check if it is a new event
  if (parsedMessage.params.result) {
    subscriptionId = parsedMessage.params.subscription;
    console.log(subscriptionId);
    const { result } = parsedMessage.params;
    console.log("New event received: ", result.topics[0]);
    const topics = result.topics.slice(1) as string[];
    const data = result.data.slice(2);
    // stringify topics
    const stringifiedTopics = topics.map((topic) => topic.slice(2));
    // combine them together
    const combined = stringifiedTopics.join("") + data;
    // decode them
    const decoded = decodeData(combined);
    // create meaningful data
    const meaningfulData = createMeaningfulData(decoded);
    console.log(meaningfulData);
  }
});

function decodeData(data: string) {
  // we have 3 data, amount, net amount, fee amount 64 bytes each
  let decoded = [];
  for (let i = 0; i < data.length; i += 64) {
    decoded.push("0x" + data.slice(i, i + 64));
  }
  return decoded;
}

interface MeaningfulData {
  from: string;
  to: string;
  currency: string;
  amount: string;
  netAmount: string;
  feeAmount: string;
}

function createMeaningfulData(decoded: string[]): MeaningfulData {
  const from = decoded[0];
  const to = decoded[1];
  const currency = decoded[2];
  const amount = decoded[3];
  const feeAmount = decoded[4];
  const netAmount = decoded[5];
  // they all are in hex, we need to convert them to decimal
  const amountInDecimal = parseInt(amount, 16);
  const netAmountInDecimal = parseInt(netAmount, 16);
  const feeAmountInDecimal = parseInt(feeAmount, 16);
  // 0x0000000000000000000000006a2d930a14203d01d76ab3e1c9601db6e97a4d49
  // but original address is 0x6a2d930a14203d01d76ab3e1c9601db6e97a4d49
  const fromAddress = "0x" + from.slice(26);
  const toAddress = "0x" + to.slice(26);
  const currencyAddress = "0x" + currency.slice(26);
  return {
    from: fromAddress,
    to: toAddress,
    currency: currencyAddress,
    amount: amountInDecimal.toString(),
    netAmount: netAmountInDecimal.toString(),
    feeAmount: feeAmountInDecimal.toString(),
  };
}

// when code down - or closed should unsubscribe
socket.on("close", () => {
  console.log("Socket closed");
  // unsubscribe
  const unsubscribeMessage = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_unsubscribe",
    params: [subscriptionId],
  };
  socket.send(JSON.stringify(unsubscribeMessage));
  clearInterval(keepAliveInterval!);
  clearTimeout(pingTimeout!);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received.");
  // unsubscribe
  const unsubscribeMessage = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_unsubscribe",
    params: [subscriptionId],
  };
  socket.send(JSON.stringify(unsubscribeMessage));
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received.");
  // unsubscribe
  const unsubscribeMessage = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_unsubscribe",
    params: [subscriptionId],
  };
  socket.send(JSON.stringify(unsubscribeMessage));
  process.exit(0);
});

process.on("exit", () => {
  console.log("Process exit");
  // unsubscribe
  const unsubscribeMessage = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_unsubscribe",
    params: [subscriptionId],
  };
  socket.send(JSON.stringify(unsubscribeMessage));
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught exception");
  console.log(error);
  // unsubscribe
  const unsubscribeMessage = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_unsubscribe",
    params: [subscriptionId],
  };
  socket.send(JSON.stringify(unsubscribeMessage));
  process.exit(1);
});
const EXPECTED_PONG_BACK = 15000;

const KEEP_ALIVE_CHECK_INTERVAL = 7500;
let pingTimeout: NodeJS.Timeout | null = null;
let keepAliveInterval: NodeJS.Timeout | null = null;

socket.on("ping", () => {
  console.log("Received ping");
  // Respond to the ping
  socket?.emit("pong");
});
socket.on("pong", () => {
  console.log("Received pong, so connection is alive, clearing the timeout");
  clearTimeout(pingTimeout!);
});

