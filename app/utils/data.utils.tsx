/** ------------ DATA FORMAT ------------ */
import { BlockData, BlockDisplay, BlockResult, BlockRow, TxRow, InputData, OutputData, TransactionData, TransactionDisplay, StackDisplay, TokenDisplay, ItemDisplay, OutputType, Block, Transaction } from '@/app/interfaces'
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
    timestamp: blockData.header.timestamp != undefined ? blockData.header.timestamp.toString() : "n/a"
  }
  return blockInfo
}

/**
 * Format table row for block
 * @param block
 * @returns Array of block rows
 */
export const formatBlockTableRow = async (block: Block): Promise<BlockRow> => {
    const blockRow = {
      number: block.num.toString(),
      blockHash: block.hash,
      nbTx: await fetchNbTxForBlock(block.hash).then((result)=> result < 1 ? '-' : result.toString()),
      age: block.timestamp.slice(0,10) + ' ' + block.timestamp.replace('T', '').slice(10,18), // Format timestamp
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

export const formatTxTableRow = async (tx: Transaction): Promise<TxRow> => {
  const txRow = {
    txHash: tx.hash,
    blockHash: tx.blockHash,
    type: await fetchTxType(tx.hash),
    address: '-',
    age: tx.timestamp.slice(0,10) + ' ' + tx.timestamp.replace('T', '').slice(10,18),
  } as TxRow
return txRow
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
      blockHash: '',
      type: 'Token',
      status: 'Item',
      address: 'n/a',
      age: 'n/a',
    } as TxRow)
  })
  return reversed ? result.reverse() : result
}

export function isBlockTable(object: any): object is BlockRow {
  if (object == undefined)
      return false
  return 'blockHash' in object
}

export function isTxTable(object: any): object is TxRow {
  if (object == undefined)
      return false
  return 'txHash' in object
}

/** ------------ REQUESTS ------------ */

export const fetchNbTxForBlock = async (blockHash: string): Promise<number> => {
  let numTxs = await fetch(`api/blockTxs/${blockHash}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    const data = await response.json()
    return data.content ? data.content.transactions.length : 0
  });
  return numTxs
}

export const fetchTxType = async (txHash: string): Promise<string> => {
  let txType = await fetch(`api/transaction/${txHash}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    const data = await response.json()
    return data.content ? data.content.outs[0].valueType : 'n/a'
  })
  return txType
}