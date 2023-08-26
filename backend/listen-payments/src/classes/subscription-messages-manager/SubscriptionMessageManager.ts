import SubscriptionMessage from "src/types/subscription-message.type";

class SubscriptionMessageManager {
  constructor(private messages: { [messageName: string]: SubscriptionMessage } = {}) {
    this.messages = {};
  }

  addMessage(
    messageName: string,
    message: SubscriptionMessage
  ) {
    this.messages[messageName] = message;
  }

  getMessage(messageName: string) {
    return this.messages[messageName];
  }
}

export default SubscriptionMessageManager;
