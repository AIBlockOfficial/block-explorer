"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Table from '@/app/ui/table'
import StatCard from '@/app/ui/statCard'
import { CubeIcon } from "@heroicons/react/24/outline"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { ListBulletIcon } from "@heroicons/react/24/outline"
import { ITable, BlockRow, TxRow } from '@/app/interfaces'
import { getRange, formatBlockTableRows, formatBlockData } from "@/app/utils"
import { BLOCK_TABLE_HEADERS_SHORT, BLOCK_PER_PAGE_SHORT } from '@/app/constants'

const TxTable: ITable = {
  headers: ["TxHash", "Type", "Status", "Age"],
  rows: []
}

export default function Page() {
  const [latestBlockNum, setLatest] = useState();
  const [blocksData, setBlocksData] = useState<BlockRow[]>([]);
  // const [txsData, setTxsData] = useState<ITxRow[]>([]); /** TODO */

  // Executed on component mount
  useEffect(() => {
    fetch(`api/latestBlock`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      setLatest(data.content ? data.content.block.header.b_num : 0) // Set latest block. If error set latest to 0 (won't load any blocks)
    });
  }, []);

  // Executed after setting latestBlock
  useEffect(() => {
    if (latestBlockNum) {
      fetch(`/api/blocks`, {
        method: 'POST',
        body: JSON.stringify(getRange((latestBlockNum - BLOCK_PER_PAGE_SHORT) >= 0 ? latestBlockNum - BLOCK_PER_PAGE_SHORT : 0, latestBlockNum)),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        const blocks = data.content.map((rawBlock: any) => formatBlockData(rawBlock)) // Format raw block to app interface
        setBlocksData(data.content ? formatBlockTableRows(blocks, true) : []) // Set blocks. If error, set latest to empty array
      });
    }
  }, [latestBlockNum])

  return (
    <>
      <div className="flex p-4 justify-evenly flex-wrap">
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Blocks'} value={latestBlockNum ? latestBlockNum + 1 : undefined} icon={<CubeIcon className='card-icons' />} href={'/blocks'} /></div>
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Transactions'} value={latestBlockNum ? undefined : undefined} icon={<ArrowsRightLeftIcon className='card-icons' />} href={'#'} /></div>
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Addresses'} value={latestBlockNum ? undefined : undefined} icon={<ListBulletIcon className='card-icons' />} href={'#'} /></div>
      </div>
      <div className="flex p-4 justify-evenly flex-wrap">
        <div className='p-2 md:w-1/2 sm:w-full'>
          <div className='w-auto flex align-bottom justify-between'>
            <p>Latest Blocks</p>
            <p className='text-xs leading-6 text-blue-900 hover:underline'><Link href={'/blocks'}>View all blocks {`->`}</Link></p>
          </div>
          <Table table={{ headers: BLOCK_TABLE_HEADERS_SHORT, rows: blocksData }} short={true} />
        </div>
        <div className='p-2 md:w-1/2 sm:w-full'>
          <div className='w-auto flex align-bottom justify-between'>
            <p>Latest Transactions</p>
            <p className='text-xs leading-6 text-blue-900 hover:underline'><Link href={'/transactions'}>View all transactions {`->`}</Link></p>
          </div>
          <Table table={TxTable} short={true} />
        </div>
      </div>
    </>
  )
}
