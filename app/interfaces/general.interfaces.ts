/** WIP, some of these structures are unfinished */
/** General interface are divided into three types : 
 *  Data    : Raw data retrieved from API calls
 *  Regular : Similar to raw data, but serves as a bridge between raw data and display data 
 *  Info    : Formatted data ready to be displayed on front-end
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
    status: string,
    nbTx: string,
    age: string,
}

export interface TxRow {
    txHash: string,
    blockNum: string,
    type: string,
    status: string,
    address: string,
    age: string,
}

export interface BlockInfo {
    hash: string
    bNum: string
    timestamp?: string
    merkleRootHash: string
    previousHash: string
    version: string
    byteSize: string
    nbTransactions: string
    unicornSeed: string
    unicornWitness: string
}

export interface TransactionInfo {
    hash: string,
    bHash: string,
    bNum: string,
    type: string,
    timpestamp: string,
    inputs: InputInfo[]
    outputs: TokenInfo[] | ItemInfo[]
}

export interface InputInfo {
    previousOutHash: string
    scriptSig: StackInfo
}

export interface StackInfo {
    op?: string
    num?: string
    bytes?: string
    signature?: string[]
    pubKey?: string[]
}

export interface TokenInfo {
    type: OutputType
    address: string
    tokens: string
    fractionatedTokens: string
    lockTime: string
}

export interface ItemInfo {
    type: OutputType
    address: string
    items: string
    lockTime: string
    genesisTransactionHash: string
    metadata: string
}

/* -------------------------------------------------------------------------- */
/*                             Data Structures                                */
/* -------------------------------------------------------------------------- */
export interface Block {
    hash: string
    bNum: number
    previousHash: string
    seed: number[]
    bits: number
    version: number
    miningTxHashNonces: {
        hash: string
        nonce: number[]
    }
    merkleRootHash: {
        merkleRootHash: string
        txsHash: string
    }
    transactions: string[]
}

export interface Transaction {
    hash: string
    druidInfo: null
    inputs: Input[]
    outputs: Output[]
    version: number
}

export interface Input {
    previousOut: {
        num: number
        tHash: string
    } | null
    scriptSig: {
        stack: StackData[]
    }
}

export interface Output {
    drsBHash: string | null
    drsTHash: string | null
    locktime: number
    scriptPubKey: string
    value:
    | { Token: number }
    | { Item: number }
    | { Token: OutputValue }
    | { Item: OutputValue }
}

export interface OutputValue {
    amount: number
    drs_tx_hash: string | null
    metadata: string | null
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