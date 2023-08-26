// actually not all types are string but nevermind.
export interface Log {
    address: string,
    topics: string[],
    data: string,
    blockNumber: string,
    transactionHash: string,
    transactionIndex: string,
    blockHash: string,
    logIndex: string,
    removed: boolean
}