import useSWR from "swr"
import useSWRInfinite from 'swr/infinite'
import { ITEMS_PER_CHUNK, ITEMS_PER_PAGE_SHORT } from "../constants"
import { Block, BlockRow, Transaction, TxRow } from "../interfaces"
import { formatBlockTableRow, formatTxTableRow } from "."

const fetcher = (url: any) => fetch(url).then(r => r.json())

const config = {
    refreshInterval: 5000,
    fetcher: fetcher
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

const getKeyBlocks = (index: number, previousPageData: any) => {
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

const getKeyTxs = (index: number, previousPageData: any) => {
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