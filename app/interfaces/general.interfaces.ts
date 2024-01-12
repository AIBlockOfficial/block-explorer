/** WIP, some of these structures are outdatted */
/* -------------------------------------------------------------------------- */
/*                             Display Structures                             */
/* -------------------------------------------------------------------------- */
export enum ItemType {
    Block,
    Transaction,
}

export interface ITable {
    headers: string[]
    rows: IBlockRow[] | ITxRow[]
}

export interface IBlockRow {
    number: string,
    blockHash: string,
    status: string,
    nbTx: string,
    age: string,
}

export interface ITxRow {
    txHash: string,
    blockNum: string,
    type: string,
    status: string,
    address: string,
    age: string,
}

export interface BlockInfo {
    hash: string;
    bNum: number;
    timestamp?: string;
    merkleRootHash: string;
    previousHash: string;
    version: number;
    byteSize: string;
    nbTransactions: number;
    unicornSeed: string; // these are bigints, better as strings
    unicornWitness: string; // these are bigints, better as strings 
}

export interface TransactionInfo {
    inputs: {
        previousOutHash: string;
        scriptSig: string;
    }[];
    outputs: TokenInfo[] | ReceiptInfo[];
}

export interface InputInfo {
    previousOutHash: string;
    scriptSig: string;
}

export interface TokenInfo {
    address: string;
    tokens: string;
    fractionatedTokens: string;
    lockTime: number;
}

export interface ReceiptInfo {
    address: string;
    receipts: number;
    lockTime: number;
    genesisTransactionHash: string;
    metadata: any;
}

/* -------------------------------------------------------------------------- */
/*                             Data Structures                                */
/* -------------------------------------------------------------------------- */
export interface Block {
    bNum: number;
    previousHash: string;
    seed: number[];
    bits: number;
    version: number;
    miningTxHashNonces: {
        hash: string;
        nonce: number[];
    };
    merkleRootHash: {
        merkleRootHash: string;
        txsHash: string;
    };
    transactions: string[];
}

export interface Transaction {
    druidInfo: null;
    inputs: Input[];
    outputs: Output[];
    version: number;
}

export interface Input {
    previousOut: {
        num: number;
        tHash: string;
    } | null;
    scriptSig: {
        stack: StackData[];
    };
}

export interface Output {
    drsBHash: string | null;
    drsTHash: string | null;
    locktime: number;
    scriptPubKey: string;
    value:
    | { Token: number }
    | { Receipt: number }
    | { Token: OutputValueV2 }
    | { Receipt: OutputValueV2 };
}

export interface OutputValueV2 {
    amount: number;
    drs_tx_hash: string | null;
    metadata: string | null;
}

/* -------------------------------------------------------------------------- */
/*                             Network Fetch Data                             */
/* -------------------------------------------------------------------------- */
export interface BlockDataWrapperV0_1 {
    block: BlockDataV0_1;
    mining_tx_hash_and_nonces: (number[] | string)[];
}

export interface BlockDataV0_1 {
    header: {
        version: number;
        bits: number;
        nonce: number[];
        b_num: number;
        seed_value: number[];
        previous_hash: string | null;
        merkle_root_hash: string;
    };
    transactions: string[];
}

export interface BlockDataV2 {
    header: {
        version: number;
        bits: number;
        nonce_and_mining_tx_hash: (number[] | string)[];
        b_num: number;
        seed_value: number[];
        previous_hash: string;
        txs_merkle_root_and_hash: string[];
    };
    transactions: string[];
}

export interface TransactionData {
    druid_info: null;
    inputs: InputData[];
    outputs: OutputData[];
    version: number;
}

export interface InputData {
    previous_out: {
        n: number;
        t_hash: string;
    };
    script_signature: {
        stack: StackData[];
    };
}

export interface OutputData {
    drs_block_hash: string | null;
    drs_tx_hash: string | null;
    locktime: number;
    script_public_key: string;
    value: { Token: number } | { Receipt: number };
}

export interface StackData {
    Op?: string;
    Num?: number;
    Bytes?: string;
    Signature?: number[];
    PubKey?: number[];
}

// Transaction
export type ITransaction = {
    inputs: ITxIn[];
    outputs: ITxOut[];
    version: number;
    druid_info: IDdeValues | null;
};

// Transaction input
export type ITxIn = {
    previous_out: IOutPoint | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    script_signature: any | null;
};

// OutPoint
export type IOutPoint = {
    t_hash: string;
    n: number;
};

// Transaction Output
export type ITxOut = {
    value: IAssetToken | IAssetItem;
    locktime: number;
    drs_block_hash: string | null;
    script_public_key: string | null;
};

// Dual-double-entry data
export type IDdeValues = {
    druid: string;
    participants: number;
    expectations: IDruidExpectation[];
};

// Dual-double-entry expectation
export type IDruidExpectation = {
    from: string;
    to: string;
    asset: IAssetToken | IAssetItem;
};

// DDE/DRUID droplet value as stored on mempool node
export type IDruidDroplet = {
    participants: number;
    tx: { [key: string]: ITransaction };
};

// Item asset type
export type IAssetItem = {
    Item: {
        amount: number;
        drs_tx_hash: string;
        metadata: string | null;
    };
};

// Token asset type
export type IAssetToken = {
    Token: number;
};
