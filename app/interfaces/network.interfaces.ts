/* -------------------------------------------------------------------------- */
/*                           Network Interfaces                               */
/* -------------------------------------------------------------------------- */
export enum Networks {
    Testnet = 'Testnet',
    Mainnet = 'Mainnet'
}

export interface Network {
    name: string
    displayName: string
    chainId: number
    sIp: string
    sPort: number
}

/* -------------------------------------------------------------------------- */
/*                                 API Routes                                 */
/* -------------------------------------------------------------------------- */

export enum IAPIRoute {
    BlocksCount = '/blocks/count',
    Block = '/block',
    Blocks= '/blocks',
    Transaction = '/transaction',
    Transactions = '/transactions',
    Address= '/accounts',
    BlockchainEntry = '/blockchain_entry',
    CirculatingSupply = '/circulating-supply'
}