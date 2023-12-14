"use client"
import Link from 'next/link'
import Table from '@/app/ui/table'
import StatCard from '@/app/ui/statCard'
import { CubeIcon } from "@heroicons/react/24/outline"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { ListBulletIcon } from "@heroicons/react/24/outline"
import { ITable } from '@/app/constants'
import BlockData from '@/app/data/blocks.json'
import TxData from '@/app/data/txs.json'


export default function Page() {
  const BlockTable: ITable = {
    headers: ["Number", "Block Hash", "Status", "Age"],
    rows: BlockData
  }

  const TxTable: ITable = {
    headers: ["TxHash", "Type", "Status", "Age"],
    rows: TxData
  }
  const loading = false
  return (
    <>
      <div className="flex p-4 justify-evenly flex-wrap">
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Blocks'} value={!loading ? 435243 : undefined} icon={<CubeIcon className='card-icons' />} href={'#'} /></div>
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Transactions'} value={!loading ? 61471565 : undefined} icon={<ArrowsRightLeftIcon className='card-icons' />} href={'#'} /></div>
        <div className='p-2 md:w-1/3 sm:w-full'><StatCard title={'Addresses'} value={!loading ? 42000891 : undefined} icon={<ListBulletIcon className='card-icons' />} href={'#'} /></div>
      </div>
      <div className="flex p-4 justify-evenly flex-wrap">
        <div className='p-2 md:w-1/2 sm:w-full'>
          <div className='w-auto flex align-bottom justify-between'>
            <p>Latest Blocks</p>
            <p className='text-xs leading-6 text-blue-900 hover:underline'><Link href={'/blocks'}>View all blocks {`->`}</Link></p>
          </div>
          <Table table={BlockTable} short={true} />
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
