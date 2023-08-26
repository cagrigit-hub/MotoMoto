interface SubscriptionMessage {
    jsonrpc: string;
    id: number;
    method: string;
    params: (string | {
        address: string;
        topics: string[];
    })[];
}

export default SubscriptionMessage;