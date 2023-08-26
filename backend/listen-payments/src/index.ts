import socket from "./services/socket/socket";
import g_subscriptionManager from "./services/global-managers/sub-message-manager";

const PaymentReceivedsubscriptionMessage = g_subscriptionManager.getMessage("paymentReceived");

socket.on("open", () => {
  socket.send(JSON.stringify(PaymentReceivedsubscriptionMessage));
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
    console.log(parsedMessage);
  }
});
