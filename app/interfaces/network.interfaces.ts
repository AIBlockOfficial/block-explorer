/* -------------------------------------------------------------------------- */
/*                                 API Routes                                 */
/* -------------------------------------------------------------------------- */

export enum IAPIRoute {
    /* --------------------------- Storage Network Routes --------------------------- */
    LatestBlock = '/latest_block',
    BlockByNum = '/block_by_num',
    BlockchainEntry = '/blockchain_entry',
    Transactions = '/transactions_by_key',
}