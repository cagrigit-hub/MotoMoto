import SubscriptionMessageManager from "../../classes/subscription-messages-manager/SubscriptionMessageManager";
import paymentReceivedSubscriptionMessage from "../web3/subscription-messages/payment-received-subscription-message";


const g_subscriptionManager = new SubscriptionMessageManager();
g_subscriptionManager.addMessage("paymentReceived", paymentReceivedSubscriptionMessage);

export default g_subscriptionManager;
