/** ------------ DATA FORMAT ------------ */
import { BlockData, BlockDisplay, BlockResult, BlockRow, TxRow, InputData, OutputData, TransactionData, TransactionDisplay, StackDisplay, TokenDisplay, ItemDisplay, OutputType, Block, Transaction, FetchedBlock, FetchedTransaction, In, Out } from '@/app/interfaces'
import { formatAmount, getUnicornSeed, getUnicornWitness } from '@/app/utils'

/** ------------ BLOCKS ------------ */
/**
 * Format block data to display format
 * @param block fetched block
 * @returns 
 */
export const formatToBlockDisplay = async (block: FetchedBlock): Promise<BlockDisplay> => {
  const blockInfo: BlockDisplay = {
    bNum: block.num.toString(),
    hash: block.hash,
    merkleRootHash: block.merkleRootHash || "n/a",
    previousHash: block.previousHash || "n/a",
    version: block.version.toString(),
    byteSize: `${new TextEncoder().encode(JSON.stringify(block)).length} bytes`,
    nbTransactions: await fetchNbTxForBlock(block.hash).then((result)=> result < 1 ? '-' : result.toString()),
    unicornSeed: "n/a",
    unicornWitness: "n/a",
    timestamp: block.timestamp || "n/a"
  }
  return blockInfo
}

/**
 * Format table row for block
 * @param block
 * @returns Array of block rows
 */
export const formatBlockTableRow = (block: Block): BlockRow => {
    const blockRow = {
      number: block.num.toString(),
      blockHash: block.hash,
      // nbTx: await fetchNbTxForBlock(block.hash).then((result)=> result < 1 ? '-' : result.toString()),
      nbTx: '-',
      // age: block.timestamp.slice(0,10) + ' ' + block.timestamp.replace('T', '').slice(10,18), // Format timestamp
      age: block.timestamp
    } as BlockRow
  return blockRow
}

/** ------------ TRANSACTIONS ------------ */

export const formatToTxDisplay = (transaction: FetchedTransaction): TransactionDisplay => {
  const type = transaction.outs[0].valueType == 'token' ? OutputType.Token : OutputType.Item
  return {
    hash: transaction.hash,
    bHash: transaction.blockHash,
    bNum: 'n/a',
    type: type.toString(),
    timpestamp: new Date(transaction.timestamp).toString(),
    inputs: transaction.ins.map((input: In) => {
      return {
        previousOut: 'n/a',
        scriptSig: {
          op: input.scriptSignature.stack[0].Op,
          num: input.scriptSignature.stack[0].Num?.toString(),
          bytes: input.scriptSignature.stack[0].Bytes,
          signature: input.scriptSignature.stack[0].Signature?.map((s:any) => s.toString()),
          pubKey: input.scriptSignature.stack[0].PubKey?.map((k:any) => k.toString()),
        } as StackDisplay
      }
    }),
    outputs: type == OutputType.Token ? transaction.outs.map((output: Out) => {
      return { // Token
        address: output.scriptPublicKey,
        tokens: output.amount + ' ABC',
        fractionatedTokens: 'n/a',
        lockTime: output.locktime.toString(),
      } as TokenDisplay
    })
      : transaction.outs.map((output: Out) => {
        return { // Item
          address: output.scriptPublicKey,
          items: output.amount,
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
  let numTxs = await fetch(`/api/blockTxs/${blockHash}`, {
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
  let txType = await fetch(`/api/transaction/${txHash}`, {
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