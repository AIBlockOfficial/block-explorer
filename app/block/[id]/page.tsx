"use client"
import React from "react"
import { Card, Typography } from "@material-tailwind/react"
import { fira } from '@/app/styles/fonts'
import Link from "next/link"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import Table from "@/app/ui/table"
import { ITable } from "@/app/constants"
import blockData from '@/app/data/blocks.json'
import txData from '@/app/data/txs.json'


const tabs = ['Overview', 'Transactions']
const fields = ['Block Hash', 'Previous Hash', 'Block Number', 'Block Status', 'Timestamp', 'Merkle Root Hash', 'Unicorn Seed', 'Unicorn Witness', 'Byte Size', 'Version']

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = React.useState(tabs[0])

  const txTable: ITable = {
    headers: ["Transaction Hash", "Block Num.", "Type", "Status", "Address", "Age"],
    rows: txData
  }

  return (
    <>
      <Card className="mt-6 w-full border border-gray-300 min-w-fit">
        <div className="mb-2 pt-4 pl-5">
          <Typography variant="lead" className="">Block</Typography>
          <Typography variant="small" className="text-gray-600">A block on the A-Block blockchain</Typography>
        </div>
        {/** TABS */}
        <div className="w-full h-12 pl-2 bg-transparent flex align-bottom justify-start">
          {tabs.map((tab, index) => {
            return (
              <div key={index} onClick={() => setActiveTab(tab)} className={`${activeTab == tab ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer`}>
                {tab}
              </div>
            )
          })}
        </div>
        {/** TABS BODYS */}
        <div className={`${activeTab == tabs[0] ? 'block' : 'hidden'} w-full h-auto`}>
          <Card className='min-h-fit w-full border-gray-300'>
            <table className='w-full min-w-max table-auto text-left rounded-sm'>
              <tbody>
                <List />
              </tbody>
            </table>
          </Card>
        </div>
        <div className={`${activeTab == tabs[1] ? 'block' : 'hidden'} w-full h-auto`}>
          <Table table={txTable} />
        </div>
      </Card>
    </>
  )
}

function List() {
  const data = Object.values(blockData[0])
  let result: JSX.Element[] = []
  fields.map((field, index) => {
    result.push(
      <tr key={index} className="border">
        <td className="pl-6 py-4 w-1/3">
          <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
            <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
            {field}
          </Typography>
        </td>
        <td className="pl-4 py-4 w-2/3">
          <Typography as={Link} href={`/block/${'number'}`} variant='small' className={`text-blue-900 text-xs ${fira.className}`}>
            {data[index] ?? ''}
          </Typography>
        </td>
      </tr>
    )
  })
  return result
}