/** ------------ DATA FORMAT ------------ */
import { Block, BlockData, BlockInfo, BlockResult, BlockRow, TxRow, InputData, OutputData, Transaction, TransactionData, TransactionInfo, StackInfo, StackData, Input, Output, TokenInfo, ItemInfo, OutputType } from '@/app/interfaces'
import { formatAmount, getUnicornSeed, getUnicornWitness } from '@/app/utils'

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
    bNum: block.bNum.toString(),
    hash: block.hash,
    merkleRootHash: block.merkleRootHash.merkleRootHash || "n/a",
    previousHash: block.previousHash || "n/a",
    version: block.version.toString(),
    byteSize: `${new TextEncoder().encode(JSON.stringify(block)).length} bytes`,
    nbTransactions: block.transactions.length.toString(),
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
export const formatBlockTableRows = (blocks: Block[], reversed: boolean): BlockRow[] => {
  const result: BlockRow[] = []
  blocks.forEach((block: Block) => {
    result.push({
      number: block.bNum.toString(),
      blockHash: block.hash,
      status: 'Unknown',
      nbTx: block.transactions.length.toString(),
      age: 'n/a',
    } as BlockRow)
  })
  return reversed ? result.reverse() : result
}

/** ------------ TRANSACTIONS ------------ */

export const formatTxData = (data: TransactionData, hash: string): Transaction => {
  return {
    hash: hash,
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

export const formatToTxInfo = (transaction: Transaction): TransactionInfo => {
  const type = transaction.outputs[0].value.hasOwnProperty('Token') ? OutputType.Token : OutputType.Item
  return {
    hash: transaction.hash,
    bHash: 'n/a',
    bNum: 'n/a',
    type: type.toString(),
    timpestamp: 'n/a',
    inputs: transaction.inputs.map((input: Input) => {
      return {
        previousOutHash: input.previousOut ? input.previousOut.tHash : 'n/a',
        scriptSig: {
          op: input.scriptSig.stack[0].Op,
          num: input.scriptSig.stack[0].Num?.toString(),
          bytes: input.scriptSig.stack[0].Bytes,
          signature: input.scriptSig.stack[0].Signature?.map((s) => s.toString()),
          pubKey: input.scriptSig.stack[0].PubKey?.map((k) => k.toString()),
        }
      }
    }),
    // outputs: []
    outputs: type == OutputType.Token ? transaction.outputs.map((output: Output) => {
      return {
        address: output.scriptPubKey,
        tokens: formatAmount(transaction, true),
        fractionatedTokens: (output.value as { Token: number }).Token.toString(),
        lockTime: output.locktime.toString(),
      } as TokenInfo
    })
      : transaction.outputs.map((output: Output) => {
        return {
          address: output.scriptPubKey,
          items: (output.value as { Item: number }).Item.toString(),
          lockTime: output.locktime.toString(),
          genesisTransactionHash: 'n/a',
          metadata: 'n/a'
        } as ItemInfo
      })
  }
}

/**
 * Format table row for transaction
 * @param txs Raw format
 * @param reversed 
 * @returns Array of transaction rows
 */
export const formatTxTableRows = (txs: any, reversed: boolean): TxRow[] => {
  const result: TxRow[] = []
  txs.forEach((tx: any) => {
    result.push({
      txHash: tx[0],
      blockNum: '',
      type: 'Unknown',
      status: 'Unknown',
      address: 'n/a',
      age: 'n/a',
    } as TxRow)
  })
  return reversed ? result.reverse() : result
}