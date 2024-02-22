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
    BlocksCount = '/blocks/count',
    Block = '/block',
    Blocks= '/blocks',
    Transaction = '/transaction',
    Transactions = '/transactions',
}