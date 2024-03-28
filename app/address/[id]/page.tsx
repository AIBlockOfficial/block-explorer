"use client"
import { useEffect, useState } from "react"
import { Card, Typography } from "@material-tailwind/react"
import { fira } from '@/app/styles/fonts'
import Link from "next/link"
import { InformationCircleIcon, Square2StackIcon } from "@heroicons/react/24/outline"
import Table, { TableType } from "@/app/ui/table"
import { isHash } from "@/app/utils"
import { AddressDisplay, IErrorInternal, TxRow } from "@/app/interfaces"
import { ADDRESS_FIELDS } from "@/app/constants"
import ErrorBlock from "@/app/ui/errorBlock"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/ui/tooltip"
import { useAddress, useAddressTxs } from "@/app/utils/fetch.utils"

const tabs = ['Overview', 'Transactions']

const col1 = 'pl-2 pr-1 w-5'
const col2 = 'py-4 w-64'
const col3 = 'pl-4 py-4 w-fit'
const helpIcon = 'h-4 w-4 text-gray-600 hover:cursor-help'

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]) // Active tab
  const [found, setFound] = useState<boolean | undefined>(undefined) // If block has been found

  const id = isHash(params.id) ? params.id : ''
  const addressDisplay: AddressDisplay | undefined | null = useAddress(id) // Block data
  let txRows: TxRow[] | undefined = useAddressTxs(id) // Block transaction data

  // useEffect(() => {
  //   if (id == undefined || addressDisplay === null)
  //     setFound(false)
  //   else if (addressDisplay != undefined)
  //     setFound(true)
  // }, [addressDisplay])

  return (
    <>
      {found == undefined || found ?
        <Card className="mt-6 w-full border border-gray-300 min-w-fit">
          <div className="mb-2 pt-4 pl-5">
            <Typography variant="lead" className="">Address</Typography>
            <Typography variant="small" className="text-gray-600">A wallet address on the AIBlock blockchain</Typography>
          </div>
          {/** TABS */}
          <div className="w-full h-12 pl-2 bg-transparent flex align-bottom justify-start">
            {/** Overview */}
            <div onClick={() => setActiveTab(tabs[0])} className={`${activeTab == tabs[0] ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer`}>
              {tabs[0]}
            </div>
            {/** Transactions */}
            <div onClick={() => { if (addressDisplay != undefined) setActiveTab(tabs[1]) }} className={`${activeTab == tabs[1] ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer flex flex-row align-middle justify-center`}>
              {tabs[1]} {addressDisplay != undefined && txRows != undefined && <div className="w-6 h-4 ml-2 bg-gray-300 rounded-t-xl rounded-b-xl"><p className={`w-fit ml-auto mr-auto font-semibold text-xs ${fira.className}`}>{txRows.length}</p></div>}
            </div>
          </div>
          {/** TAB BODIES */}
          {/** Overview */}
          <div className={`${activeTab == tabs[0] ? 'block' : 'hidden'} w-full h-auto`}>
            <Card className='min-h-fit w-full border-gray-300'>
              <List addressInfo={addressDisplay ? addressDisplay : undefined} />
            </Card>
          </div >
          {/** Transactions */}
          <div className={`${activeTab == tabs[1] ? 'block' : 'hidden'} w-full h-auto pb-2`}>
            {addressDisplay != undefined && txRows != undefined && txRows?.length > 0 &&
              <div className="px-2 pb-2"><Table type={TableType.tx} rows={txRows} short={true} /></div>
            }{txRows != undefined && txRows.length == 0 &&
              <div className="ml-auto mb-4 mr-auto p-4 font-thin border-t border-gray-200 shadow-sm bg-white">
                <Typography variant='paragraph' className='font-thin text-gray-800 ml-auto mr-auto py-2 w-fit'>No transactions</Typography>
              </div>
            }
          </div>
        </Card >
        :
        <ErrorBlock msg={IErrorInternal.BlockNotFound} />
      }
    </>
  )
}

function List({ addressInfo }: { addressInfo: any | undefined }) {
  return (
    <TooltipProvider delayDuration={100}>
      <table className='w-full min-w-fit table-auto text-left rounded-sm'>
        <tbody>
          {/** Address Hash */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The hash that identifies an address'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body text-gray-600`}>
                {ADDRESS_FIELDS[0]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {addressInfo != undefined ?
                <div className="flex flex-row">
                  <Typography as={Link} href={`/address/${addressInfo.hash}`} target="_blank" variant='small' className={`w-fit text-blue-900 ${fira.className} hover:underline`}>
                    {addressInfo.hash}
                  </Typography>
                  <Square2StackIcon className='h-4 w-4 ml-1 text-blue-900 hover:cursor-pointer active:border border-gray-50' onClick={() => navigator.clipboard.writeText(addressInfo.hash)} />
                </div>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Balance */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The balance available on an address'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {ADDRESS_FIELDS[1]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {addressInfo != undefined ?
                <Typography variant='paragraph' className={`w-fit text-blue-900 ${fira.className}`}>
                  {addressInfo.balance}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Fractionated tokens  */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The fractionnated balance available on an address'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {ADDRESS_FIELDS[2]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {addressInfo != undefined ?
                <Typography variant='paragraph' className={`w-fit text-blue-900 ${fira.className}`}>
                  {addressInfo.fractionatedTokens}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
        </tbody>
      </table>
    </TooltipProvider>
  )
}