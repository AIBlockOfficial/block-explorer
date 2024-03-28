"use client"
import Link from 'next/link'
import Table, { TableType } from '@/app/ui/table'
import StatCard from '@/app/ui/statCard'
import { CubeIcon, ArrowsRightLeftIcon, ArrowPathIcon} from "@heroicons/react/24/outline"
import { BlockRow, TxRow } from '@/app/interfaces'
import { useCirculatingSupply, useShortBlockRows, useShortTxRows } from './utils/fetch.utils'

export default function Page() {
  const blocksResult = useShortBlockRows() 
  const blocksData: BlockRow[] = blocksResult.blockRows // Short table block row data
  const latestBlockNum: number | undefined = blocksResult.number // Total number of blocks to display in card
  const txsResult = useShortTxRows()
  const txsData: TxRow[] = txsResult.txRows // Short table transaction row data
  const latestTxNum: number | undefined = txsResult.number // Total number of transactions to display in card
  const circulatingSupply = useCirculatingSupply()

  return (
    <>
      <div className="flex p-4 justify-evenly flex-wrap">
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Blocks'} value={latestBlockNum} icon={<CubeIcon className='card-icons' />} href={'/blocks'} /></div>
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Transactions'} value={latestTxNum} icon={<ArrowsRightLeftIcon className='card-icons' />} href={'/transactions'} /></div>
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Circulating supply'} value={circulatingSupply} icon={<ArrowPathIcon className='card-icons' />} href={'#'} /></div>
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