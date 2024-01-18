"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import ErrorBlock from '@/app/ui/errorBlock'
import { IErrorInternal, InputInfo, ItemInfo, ItemType, OutputType, TokenInfo, Transaction, TransactionInfo, TransactionItem } from "@/app/interfaces"
import { Card, Typography } from "@material-tailwind/react"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { fira } from '@/app/styles/fonts'
import { formatToTxInfo, formatTxData, isGenesisTx, isHash } from "@/app/utils"
import { TXS_FIELDS, TXS_IN_FIELDS, TXS_OUT_FIELDS } from "@/app/constants"

const tabs = ['Overview', 'Inputs', 'Raw']

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [rawData, setRawData] = useState<string | undefined>(undefined)
  const [txInfo, setTxInfo] = useState<TransactionInfo | undefined>(undefined);
  const [found, setFound] = useState<boolean | undefined>(undefined)

  /// The transaction information is being pulled here
  useEffect(() => {
    if (isHash(params.id) || isGenesisTx(params.id)) { // is a hash
      fetch(`/api/item/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        if (response.status == 200) {
          const data = await response.json()
          setRawData(data.content)
          // WIP, not really necessary for now but should be usefull later
          const transaction: Transaction = formatTxData((data.content as TransactionItem).Transaction, params.id)
          const transactionInfo: TransactionInfo = formatToTxInfo(transaction);
          setTxInfo(transactionInfo)
          setFound(true)
        } else {
          setFound(false)
        }
      })
    } else {
      setFound(false)
    }
  }, [])

  useEffect(() => {
    console.log('INFO: ', txInfo)
  })

  return (
    <>
      {found &&
        <>
          <Card className="mt-6 w-full border border-gray-300 min-w-fit max-w-full">
            <div className="mb-2 pt-4 pl-5">
              <Typography variant="lead" className="">Transaction</Typography>
              <Typography variant="small" className="text-gray-600">A transaction on the A-Block blockchain</Typography>
            </div>
            {/** TABS */}
            <div className="w-full h-12 pl-2 bg-transparent flex align-bottom justify-start">
              {tabs.map((tab, index) => {
                return (
                  <div key={index} onClick={() => setActiveTab(tab)} className={`${activeTab == tab ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer flex flex-row align-middle justify-center`}>
                    {tab} {tab == tabs[1] && <div className="w-6 h-4 ml-2 bg-gray-300 rounded-t-xl rounded-b-xl"><p className={`w-fit ml-auto mr-auto font-semibold text-xs ${fira.className}`}>{txInfo?.inputs.length}</p></div>}
                  </div>
                )
              })}
            </div>
            <div className={`${activeTab == tabs[0] ? 'block' : 'hidden'} w-full h-auto`}>
              <Card className='min-h-fit w-full border-gray-300'>
                <List txInfo={txInfo} />
              </Card>
            </div>
            <div className={`${activeTab == tabs[1] ? 'block' : 'hidden'} w-full h-auto`}>
              <Inputs txInputs={txInfo ? txInfo.inputs : []} />
            </div>
            <div className={`${activeTab == tabs[2] ? 'block' : 'hidden'} w-full h-auto p-4`}>
              <div className="w-full whitespace-pre-wrap">
                {rawData != undefined ? JSON.stringify(rawData, null, '\t') : []}
              </div>
            </div>
          </Card>
          {txInfo && txInfo.outputs.length > 0 &&
            <Card className={`${activeTab == tabs[0] ? 'block' : 'hidden'} p-4 mt-6 w-full border border-gray-300 min-w-fit max-w-full`}>
              <div className="pt-4 pl-5">
                <Typography variant="lead" className="">Outputs</Typography>
              </div>
              {txInfo.type == OutputType.Token &&
                <TokenOutputs txOutputs={txInfo.outputs as TokenInfo[]} />
              }{txInfo.type == OutputType.Item &&
                <TokenOutputs txOutputs={txInfo.outputs as TokenInfo[]} />
              }
            </Card>
          }
        </>
      }
      {found == false &&
        <ErrorBlock msg={IErrorInternal.TxNotFound} />
      }
    </>
  )
}

function Inputs({ txInputs }: { txInputs: InputInfo[] }) {
  return (
    txInputs.map((input, index) => {
      return (
        <table key={index} className='min-w-fit max-w-fit table-auto text-left rounded-sm'>
          <thead><tr><td><Typography variant='small' className={`ml-2 ${fira.className}`}>{index + 1}:</Typography></td></tr></thead>
          <tbody>{/** Transaction Hash */}
            <tr className="border">
              <td className="pl-6 py-4 w-1/3">
                <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
                  <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
                  {TXS_IN_FIELDS[0]}
                </Typography>
              </td>
              <td className="pl-4 py-4 w-2/3">
                <Typography variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                  {input.previousOutHash}
                </Typography>
              </td>
            </tr>
            {/** Block Hash */}
            <tr className="border">
              <td className="pl-6 py-4 w-1/3">
                <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
                  <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
                  {TXS_IN_FIELDS[1]}
                </Typography>
              </td>
              <td className="pl-4 py-4 w-2/3">
                <Typography variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                  {input.scriptSig.op ? input.scriptSig.op : []}
                  {input.scriptSig.num ? input.scriptSig.num : []}
                  {input.scriptSig.bytes ? input.scriptSig.bytes : []}
                  {input.scriptSig.signature ? input.scriptSig.signature : []}
                  {input.scriptSig.pubKey ? input.scriptSig.pubKey : []}
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      )
    })
  )
}

function TokenOutputs({ txOutputs }: { txOutputs: TokenInfo[] }) {
  console.log(txOutputs)
  if (txOutputs)
    return (
      txOutputs.map((output, index) => {
        console.log(output)
        return (
          <table key={index} className='w-full min-w-fit table-auto text-left rounded-sm mt-4'>
            <thead><tr><td><Typography variant='small' className={`ml-2 ${fira.className}`}>{index + 1}:</Typography></td></tr></thead>
            <tbody>{/** Address */}
              <tr className="border">
                <td className="pl-6 py-4 w-1/3">
                  <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
                    <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
                    {TXS_OUT_FIELDS[0]}
                  </Typography>
                </td>
                <td className="pl-4 py-4 w-2/3">
                  <Typography variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                    {output.address}
                  </Typography>
                </td>
              </tr>
              {/** Tokens */}
              <tr className="border">
                <td className="pl-6 py-4 w-1/3">
                  <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
                    <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
                    {TXS_OUT_FIELDS[1]}
                  </Typography>
                </td>
                <td className="pl-4 py-4 w-2/3">
                  <Typography variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                    {output.tokens}
                  </Typography>
                </td>
              </tr>
              {/** Fractionated Tokens */}
              <tr className="border">
                <td className="pl-6 py-4 w-1/3">
                  <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
                    <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
                    {TXS_OUT_FIELDS[2]}
                  </Typography>
                </td>
                <td className="pl-4 py-4 w-2/3">
                  <Typography variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                    {output.fractionatedTokens}
                  </Typography>
                </td>
              </tr>
              {/** LockTime */}
              <tr className="border">
                <td className="pl-6 py-4 w-1/3">
                  <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
                    <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
                    {TXS_OUT_FIELDS[3]}
                  </Typography>
                </td>
                <td className="pl-4 py-4 w-2/3">
                  <Typography variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                    {output.lockTime}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        )
      })
    )
  return []
}

function List({ txInfo }: { txInfo: TransactionInfo | undefined }) {
  return (
    <table className='w-full min-w-fit table-auto text-left rounded-sm'>
      <tbody>{/** Transaction Hash */}
        <tr className="border-b border-t">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {TXS_FIELDS[0]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {txInfo != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {txInfo.hash}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Block Hash */}
        <tr className="border-b border-t">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {TXS_FIELDS[1]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {txInfo != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {txInfo.bHash}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Block Number */}
        <tr className="border-b border-t">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {TXS_FIELDS[2]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {txInfo != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {txInfo.bNum}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Transaction type */}
        <tr className="border-b border-t">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {TXS_FIELDS[3]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {txInfo != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {txInfo.type}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Timestamp*/}
        <tr className="border-t">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {TXS_FIELDS[4]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {txInfo != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {txInfo.timpestamp}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
      </tbody>
    </table>
  )
}