/** ------------ DATA FORMAT ------------ */
import { Block, BlockData, BlockInfo, BlockResult, IBlockRow, ITxRow } from '@/app/interfaces'
import { getUnicornSeed,  getUnicornWitness} from '@/app/utils'

/**
 * Format raw block data to Block interface
 * @param block raw block
 * @returns 
 */
export const formatBlockData = (block: BlockResult): Block => {
    const blockData = (block[1] as BlockData).block 
    return {
        hash: block[0] as string,
        bNum: blockData.header.b_num,
        previousHash: blockData.header.previous_hash,
        seed: blockData.header.seed_value,
        version: blockData.header.version,
        bits: blockData.header.bits,
        miningTxHashNonces: {
          hash: blockData.header.nonce_and_mining_tx_hash[1] as string,
          nonce: blockData.header.nonce_and_mining_tx_hash[0] as number[],
        },
        merkleRootHash: {
          merkleRootHash: blockData.header.txs_merkle_root_and_hash[1],
          txsHash: blockData.header.txs_merkle_root_and_hash[0],
        },
        transactions: blockData.transactions,
      }
}
  
/**
 * Format table row for block
 * @param blocks
 * @param reversed 
 * @returns Array of block rows
 */
export function formatBlockTableRows(blocks: Block[], reversed: boolean): IBlockRow[] {
    const result: IBlockRow[] = []
    blocks.forEach((block: Block) => {
        result.push({
            number: block.bNum.toString(),
            blockHash: block.hash,
            status: 'Unknown',
            nbTx: block.transactions.length.toString(),
            age: 'n/a',
        } as IBlockRow)
    })
    return reversed ? result.reverse() : result
}

/**
 * Format table row for transaction
 * @param txs Raw format
 * @param reversed 
 * @returns Array of transaction rows
 */
export function formatTxTableRows(txs: any, reversed: boolean): ITxRow[] {
    const result: ITxRow[] = []
    txs.forEach((tx: any) => {
        result.push({
            txHash: tx[0],
            blockNum: '',
            type: 'Unknown',
            status: 'Unknown',
            address: 'n/a',
            age: 'n/a',
        } as ITxRow)
    })
    return reversed ? result.reverse() : result
}

  export const formatToBlockInfo = (block: Block): BlockInfo => {
    // console.log('INFO', block)
    const blockInfo: BlockInfo = {
      bNum: block.bNum,
      hash: block.hash,
      merkleRootHash: block.merkleRootHash.merkleRootHash || "n/a",
      previousHash: block.previousHash || "n/a",
      version: block.version,
      byteSize: `${new TextEncoder().encode(JSON.stringify(block)).length} bytes`,
      nbTransactions: block.transactions.length,
      unicornSeed: getUnicornSeed(block.seed) || "n/a",
      unicornWitness: getUnicornWitness(block.seed) || "n/a",
    }
    return blockInfo
  }