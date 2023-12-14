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