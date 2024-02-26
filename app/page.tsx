"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Table, { TableType } from '@/app/ui/table'
import StatCard from '@/app/ui/statCard'
import { CubeIcon } from "@heroicons/react/24/outline"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { Block, BlockRow, Transaction, TxRow } from '@/app/interfaces'
import { formatBlockTableRow, formatTxTableRow } from "@/app/utils"
import { ITEMS_PER_PAGE_SHORT } from '@/app/constants'

export default function Page() {
  const [latestBlockNum, setLatestBlockNum] = useState<number>();
  const [latestTxNum, setLatestTxNum] = useState<number>();
  const [blocksData, setBlocksData] = useState<BlockRow[]>([]);
  const [txsData, setTxsData] = useState<TxRow[]>([]);

  useEffect(() => {
    // Fetch blocks
    fetch(`api/blocks?limit=${ITEMS_PER_PAGE_SHORT}&offset=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      if (data.content) {
        setLatestBlockNum(data.content.pagination.total)
        const blocksRows: BlockRow[] = await data.content.blocks.map((block: Block) => formatBlockTableRow(block)) // Currently used await because nb tx of each block is fetched
        setBlocksData(blocksRows)
      }
    })
    // Fetch transactions
    fetch(`api/transactions?limit=${ITEMS_PER_PAGE_SHORT}&offset=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      if (data.content) {
        setLatestTxNum(data.content.pagination.total)
        const txRows: TxRow[] = await Promise.all(await data.content.transactions.map(async (tx: Transaction) => await formatTxTableRow(tx)))
        setTxsData(txRows)
      }
    })
  }, [])

  return (
    <>
      <div className="flex p-4 justify-evenly flex-wrap">
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Blocks'} value={latestBlockNum ? latestBlockNum : undefined} icon={<CubeIcon className='card-icons' />} href={'/blocks'} /></div>
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Transactions'} value={latestTxNum ? latestTxNum : undefined} icon={<ArrowsRightLeftIcon className='card-icons' />} href={'/transactions'} /></div>
        {/* <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Addresses'} value={latestBlockNum ? undefined : undefined} icon={<ListBulletIcon className='card-icons' />} href={'#'} /></div> */}
      </div>
      <div className="flex p-4 justify-evenly flex-wrap">
        <div className='p-2 md:w-1/2 sm:w-full'>
          <div className='w-auto flex align-bottom justify-between'>
            <p>Latest Blocks</p>
            <p className='text-xs leading-6 text-blue-900 hover:underline'><Link href={'/blocks'}>View all blocks {`->`}</Link></p>
          </div>
          <Table type={TableType.block} rows={blocksData} short={true} />
        </div>
        <div className='p-2 md:w-1/2 sm:w-full'>
          <div className='w-auto flex align-bottom justify-between'>
            <p>Latest Transactions</p>
            <p className='text-xs leading-6 text-blue-900 hover:underline'><Link href={'/transactions'}>View all transactions {`->`}</Link></p>
          </div>
          <Table type={TableType.tx} rows={txsData} short={true} />
        </div>
      </div>
    </>
  )
}