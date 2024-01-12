/** ------------ DATA FORMAT ------------ */
import { Block, BlockInfo, IBlockRow, ITxRow } from '@/app/interfaces'
import { getUnicornSeed,  getUnicornWitness} from '@/app/utils'
/**
 * Format table row for block
 * @param blocks Raw format
 * @param reversed 
 * @returns Array of block rows
 */
export function formatBlockTableRows(blocks: any, reversed: boolean): IBlockRow[] {
    const result: IBlockRow[] = [];
    blocks.forEach((block: any) => {
        result.push({
            number: block[1].block.header.b_num,
            blockHash: block[0],
            status: 'Unknown',
            nbTx: block[1].block.transactions.length,
            age: 'n/a',
        } as IBlockRow)
    });

    return reversed ? result.reverse() : result
}

/**
 * Format table row for transaction
 * @param txs Raw format
 * @param reversed 
 * @returns Array of transaction rows
 */
export function formatTxTableRows(txs: any, reversed: boolean): ITxRow[] {
    const result: ITxRow[] = [];
    txs.forEach((tx: any) => {
        result.push({
            txHash: tx[0],
            blockNum: '',
            type: 'Unknown',
            status: 'Unknown',
            address: 'n/a',
            age: 'n/a',
        } as ITxRow)
    });

    return reversed ? result.reverse() : result
}

export const formatToBlockInfo = (data: any): BlockInfo => {
    const block: Block = data.block;
  
    const blockInfo: BlockInfo = {
      bNum: block.bNum,
      hash: data.hash,
      merkleRootHash: block.merkleRootHash.merkleRootHash || "N/A",
      previousHash: block.previousHash || "N/A",
      version: block.version,
      byteSize: `${new TextEncoder().encode(JSON.stringify(block)).length} bytes`,
      nbTransactions: block.transactions.length,
      unicornSeed: getUnicornSeed(block.seed) || "N/A",
      unicornWitness: getUnicornWitness(block.seed) || "N/A",
    };
    return blockInfo;
  };