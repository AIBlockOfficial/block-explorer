import useSWR from "swr"
import useSWRInfinite from 'swr/infinite'
import { ITEMS_PER_CHUNK, ITEMS_PER_PAGE_SHORT } from "@/app/constants"
import { AddressDisplay, Block, BlockDisplay, BlockRow, BlocksResult, Coinbase, CoinbaseDisplay, FetchedBlock, FetchedTransaction, Transaction, TransactionDisplay, TransactionsResult, TxRow } from "@/app/interfaces"
import { formatBlockTableRow, formatToAddressDisplay, formatToBlockDisplay, formatToCoinbaseDisplay, formatToTxDisplay, formatTxTableRow } from "./data.utils"

const fetcher = (url: any) => fetch(url).then(r => r.json())

const config = {
    refreshInterval: 30000,
    fetcher: fetcher
}

export const useBlock = (id: string): BlockDisplay | undefined | null => {
    const { data } = useSWR(`/api/block/${id}`, config)
    if (data != undefined) {
        if (data.content) {
            const blockDisplay: BlockDisplay = formatToBlockDisplay(data.content as FetchedBlock)
            return blockDisplay
        } else
            return null
    }
    return undefined
}

export const useBlockTxs = (id: string): TxRow[] => {
    const { data } = useSWR(`/api/blockTxs/${id}`, config)
    if (data != undefined) {
        if (data.content) {
            const txRows: TxRow[] = data.content.transactions.map((tx: Transaction) => formatTxTableRow(tx))
            return txRows
        }
    }
    return []
}

export const useCoinbaseTx = (id: string): CoinbaseDisplay | undefined => {
    const { data } = useSWR(`/api/item/${id}`, config)
    if (data != undefined) {
        if (data.content[0][1]) {
            const coinbaseDisplay: CoinbaseDisplay = formatToCoinbaseDisplay(data.content[0][1] as Coinbase)
            return coinbaseDisplay
        }
    }
    return undefined
}

export const useTransaction = (id: string): TransactionDisplay | undefined | null => {
    const { data } = useSWR(`/api/transaction/${id}`, config)
    if (data != undefined) {
        if (data.content) {
            const txDisplay: TransactionDisplay = formatToTxDisplay(data.content as FetchedTransaction)
            return txDisplay
        } else
            return null
    }
    return undefined
}

export const useRawTransaction = (id: string): any | undefined => {
    const { data } = useSWR(`/api/item/${id}`, config)
    if (data != undefined) {
        if (data.content[0][1]) {
            const rawTx: any = data.content[0][1] as Coinbase
            return rawTx
        }
    }
    return undefined
}

export const useShortBlockRows = (): { blockRows: BlockRow[], number: number | undefined } => {
    const { data } = useSWR(`api/blocks?limit=${ITEMS_PER_PAGE_SHORT}&offset=0`, config)
    if (data != undefined) {
        if (data.content) {
            const blocksRows: BlockRow[] = data.content.blocks.map((block: Block) => formatBlockTableRow(block)) // Currently used await because nb tx of each block is fetched
            return { blockRows: blocksRows, number: data.content.pagination.total }
        }
    }
    return { blockRows: [], number: undefined }
}

export const useShortTxRows = (): { txRows: TxRow[], number: number | undefined } => {
    const { data } = useSWR(`api/transactions?limit=${ITEMS_PER_PAGE_SHORT}&offset=0`, config)
    if (data != undefined) {
        if (data.content) {
            const txRows: TxRow[] = data.content.transactions.map((tx: Transaction) => formatTxTableRow(tx))
            return { txRows: txRows, number: data.content.pagination.total }
        }
    }
    return { txRows: [], number: undefined }
}

const getKeyBlocks = (index: number, previousPageData: { content: BlocksResult } | null): string | null => {
    if (previousPageData && ((ITEMS_PER_CHUNK * index)) > previousPageData.content.pagination.total)
        return null // reached the end
    return `api/blocks?limit=${ITEMS_PER_CHUNK}&offset=${(ITEMS_PER_CHUNK * index)}` // SWR key
}

export const useInfiniteBlockRows = (): { blockRows: BlockRow[], size: number, setSize: Function } => {
    const { data, size, setSize } = useSWRInfinite(getKeyBlocks, fetcher)
    if (data != undefined) {
        if (data.length > 0) {
            let list = [];
            let prev = undefined
            for (let i = 0; i < data.length; i++) {
                const chunk = data[i];
                const blocksRows: BlockRow[] = chunk.content.blocks.map((block: Block) => formatBlockTableRow(block)) // Currently used await because nb tx of each block is fetched
                if (prev && prev?.number == blocksRows[0].number)  // Handle duplicates if block number increases during scroll
                    blocksRows.shift()
                prev = blocksRows[blocksRows.length - 1] // Set prev to check for duplicates
                list.push(...blocksRows) // Update main list
            }
            return { blockRows: list, size, setSize }
        }
    }
    return { blockRows: [], size, setSize }
}

const getKeyTxs = (index: number, previousPageData: { content: TransactionsResult } | null): string | null => {
    if (previousPageData && ((ITEMS_PER_CHUNK * index)) > previousPageData.content.pagination.total)
        return null // reached the end
    return `api/transactions?limit=${ITEMS_PER_CHUNK}&offset=${(ITEMS_PER_CHUNK * index)}` // SWR key
}

export const useInfiniteTxRows = (): { txRows: TxRow[], size: number, setSize: Function } => {
    const { data, size, setSize } = useSWRInfinite(getKeyTxs, fetcher)
    if (data != undefined) {
        if (data.length > 0) {
            let list = [];
            let prev = undefined
            for (let i = 0; i < data.length; i++) {
                const chunk = data[i];
                const txsRows: TxRow[] = chunk.content.transactions.map((tx: Transaction) => formatTxTableRow(tx)) // Currently used await because nb tx of each block is fetched
                if (prev && prev?.txHash == txsRows[0].txHash)  // Handle duplicates if block number increases during scroll
                    txsRows.shift()
                prev = txsRows[txsRows.length - 1] // Set prev to check for duplicates
                list.push(...txsRows) // Update main list
            }
            return { txRows: list, size, setSize }
        }
    }
    return { txRows: [], size, setSize }
}

export const useCirculatingSupply = (): number | undefined => {
    const { data } = useSWR(`api/circulatingSupply`, config)
    if (data != undefined) {
        if (data.content) {
            return data.content.circulatingSupply
        }
    }
    return undefined
}

export const useAddress = (id: string): AddressDisplay | undefined | null => {
    const { data } = useSWR(`/api/address/${id}`, config)
    if (data != undefined) {
        if (data.content) {
            const addressDisplay: AddressDisplay = formatToAddressDisplay(id, data.content)
            return addressDisplay
        } else
            return null
    }
    return undefined
}

export const useAddressTxs = (id: string): TxRow[] => {
    const { data } = useSWR(`/api/addressTxs/${id}`, config)
    if (data != undefined) {
        if (data.content) {
            const txRows: TxRow[] = data.content.transactions.map((tx: Transaction) => formatTxTableRow(tx))
            return txRows
        }
    }
    return []
}