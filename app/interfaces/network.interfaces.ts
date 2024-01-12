/* -------------------------------------------------------------------------- */
/*                                 API Routes                                 */
/* -------------------------------------------------------------------------- */
export enum Networks {
    Testnet = 'Testnet',
    Mainnet = 'Mainnet'
}

export interface Network {
    name: string;
    displayName: string;
    chainId: number;
    sIp: string;
    sPort: number;
}

export enum IAPIRoute {
    /* --------------------------- Storage Network Routes --------------------------- */
    LatestBlock = '/latest_block',
    BlockByNum = '/block_by_num',
    BlockchainEntry = '/blockchain_entry',
    Transactions = '/transactions_by_key',
}