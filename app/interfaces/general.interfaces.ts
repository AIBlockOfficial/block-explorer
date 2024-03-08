/* -------------------------------------------------------------------------- */
/*                          General Interface Structures                      */
/* -------------------------------------------------------------------------- */

export enum ItemType {
    Block,
    Transaction
}

export enum OutputType {
    Token = 'token',
    Item = 'item'
}

/* -------------------------------------------------------------------------- */
/*                             Display Structures                             */
/* -------------------------------------------------------------------------- */

export interface BlockRow {
    number: string
    blockHash: string
    previousHash: string
    nbTx: string
    age: string
}

export interface TxRow {
    txHash: string
    blockHash: string
    type: string
    address: string
    age: string
}

export interface BlockDisplay {
    hash: string
    bNum: string
    timestamp: string
    nonce: string | undefined
    miningTxHash: string | undefined
    merkleRootHash: string
    previousHash: string
    version: string
    byteSize: string
    nbTransactions: string
    unicornSeed: string
    unicornWitness: string
}

export interface CoinbaseDisplay {
    tokens: string
    fractionatedTokens: string
    locktime: string
    version: string
    scriptPubKey: string
}

export interface TransactionDisplay {
    hash: string
    bHash: string
    bNum: string
    type: string
    timpestamp: string
    inputs: InputDisplay[]
    outputs: TokenDisplay[] | ItemDisplay[]
}

export interface InputDisplay {
    previousOut: string
    scriptSig: {stack: StackDisplay[]}
}

export interface StackDisplay {
    op?: string
    num?: string
    bytes?: string
    signature?: string[]
    pubKey?: string[]
}

export interface TokenDisplay {
    valueType: OutputType
    address: string
    tokens: string
    fractionatedTokens: string
    lockTime: string
}

export interface ItemDisplay {
    valueType: OutputType
    address: string
    items: string
    drsBlockHash: string 
    lockTime: string
    genesisTransactionHash: string
    metadata: string
}

/* -------------------------------------------------------------------------- */
/*                     Data from explorer backend                             */
/* -------------------------------------------------------------------------- */

export interface BlocksResult {
    blocks: Block[]
    pagination: Pagination
}

export interface Block {
    hash: string
    num: number
    previousHash: string
    nbTx: number
    timestamp: string
    version: number
}

export interface FetchedBlock extends Block {
    nonceAndMiningTxHash: any[]
    merkleRootHash: string
    bits: number
    seed: any
}

export interface Coinbase {
    druid_info: null
    fees: any[]
    inputs: any[]
    outputs: any[]
    version: number
}

export interface Transaction {
    hash: string
    blockHash: string
    version: number
    timestamp: string
    txType?: string
}

export interface FetchedTransaction extends Transaction {
    fees: any
    druidInfo: string | null
    ins: In[]
    outs: Out[]
}

export interface In {
    scriptSignature: {
        stack: StackData[]
    }
    previousOutTxHash: string | null
    previousOutTxN: string | null
}

export interface Out {
    valueType: string
    amount: string
    locktime: number
    drsBlockHash: string | null
    scriptPublicKey: string
    itemMetadata: string | null
    n: number
}

export interface StackData {
    Op?: string
    Num?: number
    Bytes?: string
    Signature?: number[]
    PubKey?: number[]
}

export interface Pagination {
    limit: number
    offset: number
    total: number
}