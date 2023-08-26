type ContractABI = Array<FunctionItem | EventItem | FallbackItem | ReceiveItem>;

interface FunctionItem {
    inputs: Array<Parameter>;
    name: string;
    outputs: Array<Parameter>;
    stateMutability: StateMutability;
    type: 'function';
}

interface EventItem {
    anonymous: boolean;
    inputs: Array<EventParameter>;
    name: string;
    type: 'event';
}

interface FallbackItem {
    stateMutability: 'payable';
    type: 'fallback';
}

interface ReceiveItem {
    stateMutability: 'payable';
    type: 'receive';
}

interface Parameter {
    internalType: string;
    name: string;
    type: string;
}

interface EventParameter {
    indexed: boolean;
    internalType: string;
    name: string;
    type: string;
}

type StateMutability = 'pure' | 'view' | 'nonpayable' | 'payable';


export type { ContractABI, FunctionItem, EventItem, FallbackItem, ReceiveItem, Parameter, EventParameter, StateMutability };