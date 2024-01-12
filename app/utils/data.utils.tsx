/** ------------ DATA FORMAT ------------ */
import { Block, BlockData, BlockInfo, BlockResult, IBlockRow, ITxRow, InputData, OutputData, Transaction, TransactionData, TransactionInfo } from '@/app/interfaces'
import { getUnicornSeed, getUnicornWitness } from '@/app/utils'

/** ------------ BLOCKS ------------ */
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

export const formatToBlockInfo = (block: Block): BlockInfo => {
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

/**
 * Format table row for block
 * @param blocks
 * @param reversed 
 * @returns Array of block rows
 */
export const formatBlockTableRows = (blocks: Block[], reversed: boolean): IBlockRow[] => {
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

/** ------------ TRANSACTIONS ------------ */

export const formatTxData = (data: TransactionData): Transaction => {
  return {
    druidInfo: data.druid_info,
    inputs: data.inputs.map((input: InputData) => {
      return {
        previousOut: input.previous_out
          ? {
            num: input.previous_out.n,
            tHash: input.previous_out.t_hash,
          }
          : null,
        scriptSig: input.script_signature,
      };
    }),
    outputs: data.outputs.map((output: OutputData) => {
      return {
        drsBHash: output.drs_block_hash,
        drsTHash: output.drs_tx_hash,
        locktime: output.locktime,
        scriptPubKey: output.script_public_key,
        value: output.value,
      };
    }),
    version: data.version,
  };
}

// export const formatToTxInfo = (transaction: Transaction): TransactionInfo => {
//   const transactionInfo: TransactionInfo = {
//     inputs: transaction.inputs.map((input)=> {
//       return {previousOutHash: input.previousOut?.tHash, }
//     })
//     outputs: 
//   }
//   return transactionInfo
// }

/**
 * Format table row for transaction
 * @param txs Raw format
 * @param reversed 
 * @returns Array of transaction rows
 */
export const formatTxTableRows = (txs: any, reversed: boolean): ITxRow[] => {
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