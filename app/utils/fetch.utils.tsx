import useSWR from "swr"
import { ITEMS_PER_PAGE_SHORT } from "../constants"
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
    console.log('tx', data)
    if (data != undefined) {
        if (data.content) {
            const txRows: TxRow[] = data.content.transactions.map((tx: Transaction) => formatTxTableRow(tx))
            return { txRows: txRows, number: data.content.pagination.total }
        }
    }
    return { txRows: [], number: undefined }
}