
interface SubscriptionMessage {
    jsonrpc: string;
    id: number;
    method: string;
    params: (string | {
        address: string;
        topics: string[];
    })[];
}

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
