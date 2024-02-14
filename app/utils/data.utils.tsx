/** ------------ DATA FORMAT ------------ */
import { BlockData, BlockDisplay, BlockResult, BlockRow, TxRow, InputData, OutputData, TransactionData, TransactionDisplay, StackDisplay, TokenDisplay, ItemDisplay, OutputType } from '@/app/interfaces'
import { formatAmount, getUnicornSeed, getUnicornWitness } from '@/app/utils'

/** ------------ BLOCKS ------------ */
/**
 * Format raw block data to Block display
 * @param block raw block
 * @returns 
 */
export const formatToBlockDisplay = (block: BlockResult): BlockDisplay => {
  const blockData = (block[1] as BlockData).block

  const blockInfo: BlockDisplay = {
    bNum: blockData.header.b_num.toString(),
    hash: block[0] as string,
    merkleRootHash: blockData.header.txs_merkle_root_and_hash[1] || "n/a",
    previousHash: blockData.header.previous_hash || "n/a",
    version: blockData.header.version.toString(),
    byteSize: `${new TextEncoder().encode(JSON.stringify(blockData)).length} bytes`,
    nbTransactions: blockData.transactions.length.toString(),
    unicornSeed: getUnicornSeed(blockData.header.seed_value) || "n/a",
    unicornWitness: getUnicornWitness(blockData.header.seed_value) || "n/a",
  }
  return blockInfo
}

/**
 * Format table row for block
 * @param block
 * @param reversed 
 * @returns Array of block rows
 */
export const formatBlockTableRow = (block: BlockResult): BlockRow => {
    const blockData = (block[1] as BlockData).block
    const blockRow = {
      number: blockData.header.b_num.toString(),
      blockHash: blockData.header.previous_hash,
      status: 'Unknown',
      nbTx: blockData.transactions.length.toString(),
      age: blockData.header.timestamp.toString(), // Format timestamp
    } as BlockRow
  return blockRow
}


/** ------------ TRANSACTIONS ------------ */

export const formatToTxDisplay = (transaction: TransactionData, hash: string): TransactionDisplay => {
  const type = transaction.outputs[0].value.hasOwnProperty('Token') ? OutputType.Token : OutputType.Item
  return {
    hash: hash,
    bHash: 'n/a',
    bNum: 'n/a',
    type: type.toString(),
    timpestamp: 'n/a',
    inputs: transaction.inputs.map((input: InputData) => {
      return {
        previousOutHash: input.previous_out ? input.previous_out.t_hash : 'n/a',
        scriptSig: {
          op: input.script_signature.stack[0].Op,
          num: input.script_signature.stack[0].Num?.toString(),
          bytes: input.script_signature.stack[0].Bytes,
          signature: input.script_signature.stack[0].Signature?.map((s:any) => s.toString()),
          pubKey: input.script_signature.stack[0].PubKey?.map((k:any) => k.toString()),
        } as StackDisplay
      }
    }),
    outputs: type == OutputType.Token ? transaction.outputs.map((output: OutputData) => {
      return { // Token
        address: output.script_public_key,
        tokens: formatAmount(transaction, true) + ' ABC',
        fractionatedTokens: (output.value as { Token: number }).Token.toString(),
        lockTime: output.locktime.toString(),
      } as TokenDisplay
    })
      : transaction.outputs.map((output: OutputData) => {
        return { // Item
          address: output.script_public_key,
          items: (output.value as { Item: number }).Item.toString(),
          lockTime: output.locktime.toString(),
          genesisTransactionHash: 'n/a',
          metadata: 'n/a'
        } as ItemDisplay
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
      type: 'Token',
      status: 'Item',
      address: 'n/a',
      age: 'n/a',
    } as TxRow)
  })
  return reversed ? result.reverse() : result
}