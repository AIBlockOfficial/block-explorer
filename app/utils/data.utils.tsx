/** ------------ DATA FORMAT ------------ */
import { BlockDisplay, BlockRow, TxRow, TransactionDisplay, StackDisplay, TokenDisplay, ItemDisplay, OutputType, Block, Transaction, FetchedBlock, FetchedTransaction, In, Out, StackData, InputDisplay, CoinbaseDisplay, Coinbase, AddressDisplay } from '@/app/interfaces'
import { getUnicornSeed, getUnicornWitness, tokenValue } from './display.utils'
import { TOKEN_TICKER } from '@/app/constants'

/** ------------ BLOCKS ------------ */
/**
 * Format block data for display
 * @param block fetched block
 * @returns formatted block for display
 */
export const formatToBlockDisplay = (block: FetchedBlock): BlockDisplay => {
  const blockInfo: BlockDisplay = {
    bNum: block.num.toString(),
    hash: block.hash,
    nonce: block.nonceAndMiningTxHash[0].toString() || undefined,
    miningTxHash: block.nonceAndMiningTxHash[1] || undefined,
    merkleRootHash: block.merkleRootHash || "n/a",
    previousHash: block.previousHash || "n/a",
    version: block.version.toString(),
    byteSize: `${new TextEncoder().encode(JSON.stringify(block)).length} bytes`,
    nbTransactions: '',
    unicornSeed: getUnicornSeed(block.seed),
    unicornWitness: getUnicornWitness(block.seed),
    timestamp: block.timestamp || "n/a"
  }
  return blockInfo
}

/**
 * Format table row for block
 * @param block
 * @returns Block row for table display
 */
export const formatBlockTableRow = (block: Block): BlockRow => {
  const blockRow = {
    number: block.num.toString(),
    blockHash: block.hash,
    previousHash: block.previousHash,
    nbTx: block.nbTx.toString(),
    age: block.timestamp
  } as BlockRow
  return blockRow
}

/** ------------ TRANSACTIONS ------------ */
/**
 * Format transaction data for display
 * @param transaction fetched transaction
 * @returns formatted transaction for display
 */
export const formatToTxDisplay = (transaction: FetchedTransaction): TransactionDisplay => {
  const type = transaction.outs.length > 0 ? (transaction.outs[0].valueType == 'token' ? OutputType.Token : OutputType.Item) : 'n/a'
  return {
    hash: transaction.hash,
    bHash: transaction.blockHash,
    bNum: 'n/a',
    type: type.toString(),
    timpestamp: new Date(transaction.timestamp).toString(),
    inputs: transaction.ins.map((input: In) => {
      return {
        previousOut: input.previousOutTxHash ? input.previousOutTxHash : 'n/a',
        scriptSig: {
          stack: input.scriptSignature.stack.map((stackItem: StackData) => {
            return {
              op: stackItem.Op,
              num: stackItem.Num?.toString(),
              bytes: stackItem.Bytes,
              signature: stackItem.Signature?.map((s: any) => s.toString()),
              pubKey: stackItem.PubKey?.map((k: any) => k.toString()),
            } as StackDisplay
          })
        }
      } as InputDisplay
    }),
    outputs: type == OutputType.Token ? transaction.outs.map((output: Out) => {
      return { // Token
        valueType: output.valueType,
        address: output.scriptPublicKey,
        tokens: tokenValue(parseInt(output.amount)) + ' ' + TOKEN_TICKER,
        fractionatedTokens: output.amount,
        lockTime: output.locktime.toString(),
      } as TokenDisplay
    })
      : transaction.outs.map((output: Out) => {
        return { // Item
          valueType: output.valueType,
          address: output.scriptPublicKey,
          items: output.amount,
          genesisHash: output.genesisHash ? output.genesisHash : 'null',
          lockTime: output.locktime.toString(),
          metadata: output.itemMetadata ? output.itemMetadata : 'null',
        } as ItemDisplay
      })
  }
}

/**
 * Format table row for transaction
 * @param block
 * @returns Transaction row for table display
 */
export const formatTxTableRow = (tx: Transaction | any): TxRow => {
  let type = tx.txType ? tx.txType : 'n/a'
  if (type == 'n/a' && tx.outs) // Quick fix, needs to be changed on explorer-backend
    type = tx.outs[0].valueType == 'token' ? OutputType.Token : OutputType.Item
  const txRow = {
    txHash: tx.hash,
    blockHash: tx.blockHash,
    address: '-',
    type: type,
    age: tx.timestamp,
  } as TxRow
  return txRow
}

export const formatToCoinbaseDisplay = (tx: Coinbase): CoinbaseDisplay => {
  const coinbase = {
    tokens: tokenValue(tx.outs[0].amount) + ' ' + TOKEN_TICKER,
    fractionatedTokens: tx.outs[0].amount.toString(),
    locktime: tx.outs[0].locktime.toString(),
    version: tx.version.toString(),
    scriptPubKey: tx.outs[0].scriptPublicKey,
  } as CoinbaseDisplay
  return coinbase
}

/**
 * Format address data for display
 * @param address fetched address
 * @returns formatted address for display
 */
export const formatToAddressDisplay = (id: string, address: { balance: string }): AddressDisplay => {
  const blockInfo: AddressDisplay = {
    hash: id,
    balance: tokenValue(parseInt(address.balance)) + ' ' + TOKEN_TICKER,
    fractionatedTokens: address.balance
  }
  return blockInfo
}