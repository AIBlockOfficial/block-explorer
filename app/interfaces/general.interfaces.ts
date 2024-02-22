/** WIP, some of these structures are unfinished */
/** General interface are divided into three types : 
 *  Data    : Raw data retrieved from API calls
 *  Display    : Formatted data ready to be displayed on front-end
 */
/* -------------------------------------------------------------------------- */
/*                             Display Structures                             */
/* -------------------------------------------------------------------------- */
export enum ItemType {
    Block,
    Transaction,
}

export enum OutputType {
    Token = 'Token',
    Item = 'Item'
}

export interface ITable {
    headers: string[]
    rows: BlockRow[] | TxRow[]
}

export interface BlockRow {
    number: string,
    blockHash: string,
    nbTx: string,
    age: string,
}

export interface TxRow {
    txHash: string,
    blockHash: string,
    type: string,
    address: string,
    age: string,
}

export interface BlockDisplay {
    hash: string
    bNum: string
    timestamp: string
    merkleRootHash: string
    previousHash: string
    version: string
    byteSize: string
    nbTransactions: string
    unicornSeed: string
    unicornWitness: string
}

export interface TransactionDisplay {
    hash: string,
    bHash: string,
    bNum: string,
    type: string,
    timpestamp: string,
    inputs: InputDisplay[]
    outputs: TokenDisplay[] | ItemDisplay[]
}

export interface InputDisplay {
    previousOutHash: string
    scriptSig: StackDisplay
}

export interface StackDisplay {
    op?: string
    num?: string
    bytes?: string
    signature?: string[]
    pubKey?: string[]
}

export interface TokenDisplay {
    type: OutputType
    address: string
    tokens: string
    fractionatedTokens: string
    lockTime: string
}

export interface ItemDisplay {
    type: OutputType
    address: string
    items: string
    lockTime: string
    genesisTransactionHash: string
    metadata: string
}

/* -------------------------------------------------------------------------- */
/*                     Replace Network Fetch Data                             */
/* -------------------------------------------------------------------------- */

export interface BlocksResult {
    blocks: Block[],
    pagination: Pagination,
}

export interface Block {
    hash: string
    num: number
    previousHash: string
    timestamp: string
    version: number
}

export interface Transaction {
    blockHash: string,
    hash: string,
    timestamp: string,
    version: number
}

export interface Pagination {
    limit: number,
    offset: number,
    total: number
}

/* -------------------------------------------------------------------------- */
/*                             Network Fetch Data                             */
/* -------------------------------------------------------------------------- */
/**
 *  Network Fetched data is the raw format of blockchain items when retrieved through the API.
 */
export type BlockResult = (string | BlockData)[] // when fetching block_by_num or latestBlock, the hash is returned seperate from main object

export type NonceMiningTx = (number[] | string)[]

export interface BlockData {
    block: {
        hash: string,
        header: {
            version: number
            bits: number
            nonce_and_mining_tx_hash: NonceMiningTx
            b_num: number
            seed_value: number[]
            timestamp: number
            previous_hash: string
            txs_merkle_root_and_hash: string[]
        }
        transactions: string[]
    }
}

export interface BlockItem {
    Block: BlockData
}

export interface TransactionItem {
    Transaction: TransactionData
}

export interface TransactionData {
    druid_info: null
    inputs: InputData[]
    outputs: OutputData[]
    version: number
}

export interface InputData {
    previous_out: {
        n: number
        t_hash: string
    }
    script_signature: {
        stack: StackData[]
    }
}

export interface OutputData {
    drs_block_hash: string | null
    drs_tx_hash: string | null
    locktime: number
    script_public_key: string
    value: { Token: number } | { Item: number }
}

export interface StackData {
    Op?: string
    Num?: number
    Bytes?: string
    Signature?: number[]
    PubKey?: number[]
}