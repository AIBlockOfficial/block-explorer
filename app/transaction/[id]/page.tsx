"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ITable, Transaction, TransactionInfo, TransactionItem } from "@/app/interfaces"
import { Card, Typography } from "@material-tailwind/react"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { fira } from '@/app/styles/fonts'
import txData from '@/app/data/txs.json'
import { formatTxData, isHash } from "@/app/utils"
import { TXS_FIELDS } from "@/app/constants"


const tabs = ['Overview', 'Inputs']

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [TxInfo, setTxInfo] = useState<TransactionInfo | undefined | any>(undefined);
  const [TxInputs, setTxInputs] = useState<any>([])
  const [found, setFound] = useState<boolean | undefined>(undefined)

  const txTable: ITable = {
    headers: ["Transaction Hash", "Block Num.", "Type", "Status", "Address", "Age"],
    rows: txData
  }

  /// The transaction information is being pulled here
  useEffect(() => {
    if (isHash(params.id)) { // is a hash
      fetch(`/api/item/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        if (response.status == 200) {
          const data = await response.json()
          const transaction: Transaction = formatTxData((data.content as TransactionItem).Transaction)
          console.log('TX', transaction)
          setTxInfo(transaction);
          // const txInfo: TransactionInfo = formatToTxInfo(transaction);
          // setTxInfo(txInfo)
          setFound(true)
        } else {
          setFound(false)
        }
      })
    }
  }, [])

  return (
    <>
      <Card className="mt-6 w-full border border-gray-300 min-w-fit">
        <div className="mb-2 pt-4 pl-5">
          <Typography variant="lead" className="">Transaction (WIP)</Typography>
          <Typography variant="small" className="text-gray-600">A transaction on the A-Block blockchain</Typography>
        </div>
        <div className="w-full h-12 pl-2 bg-transparent flex align-bottom justify-start">
          {tabs.map((tab, index) => {
            return (
              <div key={index} onClick={() => setActiveTab(tab)} className={`${activeTab == tab ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer`}>
                {tab}
              </div>
            )
          })}
        </div>
        <div className={`${activeTab == tabs[0] ? 'block' : 'hidden'} w-full h-auto`}>
          <Card className='min-h-fit w-full border-gray-300 p-4'>
            <>{JSON.stringify(TxInfo)}</>

            {/* <table className='w-full min-w-max table-auto text-left rounded-sm'>
              <tbody>
                <List />
              </tbody>
            </table> */}
          </Card>
        </div>

        <div className={`${activeTab == tabs[1] ? 'block' : 'hidden'} w-full h-auto`}>
        </div>

      </Card>
    </>
  )
}

function List() {
  const data = Object.values(txData[0])
  let result: JSX.Element[] = []
  TXS_FIELDS.map((field, index) => {
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
            {'n/a'}
          </Typography>
        </td>
      </tr>
    )
  })
  return result
}