"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import ErrorBlock from '@/app/ui/errorBlock'
import { IErrorInternal, InputDisplay, ItemDisplay, ItemType, OutputType, TokenDisplay, TransactionDisplay, TransactionItem } from "@/app/interfaces"
import { Card, Typography } from "@material-tailwind/react"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { fira } from '@/app/styles/fonts'
import { formatToTxDisplay, isGenesisTx, isHash } from "@/app/utils"
import { TXS_FIELDS, TXS_IN_FIELDS, TXS_OUT_FIELDS } from "@/app/constants"
import { CountBadge } from "@/app/ui/countBadge"

const tabs = ['Overview', 'Inputs', 'Outputs', 'Raw']
const col1 = 'pl-2 pr-1 w-5'
const col2 = 'py-4 w-64'
const col3 = 'pl-4 py-4 w-fit'
const helpIcon = 'h-4 w-4 text-gray-600 hover:cursor-help'

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [rawData, setRawData] = useState<string | undefined>(undefined)
  const [txDisplay, setTxDisplay] = useState<TransactionDisplay | undefined>(undefined);
  const [found, setFound] = useState<boolean | undefined>(undefined)

  /// The transaction information is being pulled here
  useEffect(() => {
    console.log(params.id)
    if (isHash(params.id) || isGenesisTx(params.id)) { // is a hash
      console.log('is hash?')
      fetch(`/api/transaction/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json()
        if (data.content) {
          setRawData(data.content)
          console.log(data.content)
          const transactionInfo: TransactionDisplay = formatToTxDisplay(data.content);
          setTxDisplay(transactionInfo)
          setFound(true)
        } else {
          setFound(false)
        }
      })
    } else {
      setFound(false)
    }
  }, [])
  return (
    <>
      {found == undefined || found ?
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
                  {tab}
                  {txDisplay != undefined &&
                    <>
                      {tab == tabs[1] ? <CountBadge count={txDisplay?.inputs.length.toString()} /> : ''}
                      {tab == tabs[2] ? <CountBadge count={txDisplay?.outputs.length.toString()} /> : ''}
                    </>
                  }
                </div>
              )
            })}
          </div>
          <div className={`${activeTab == tabs[0] ? 'block' : 'hidden'} w-full h-auto`}>
            <Card className='min-h-fit w-full border-gray-300'>
              <List txInfo={txDisplay} />
            </Card>
          </div>
          <div className={`${activeTab == tabs[1] ? 'block' : 'hidden'} w-full h-auto`}>
            <div className="px-4 pb-4">
              <Inputs txInputs={txDisplay ? txDisplay.inputs : []} />
            </div>
          </div>
          <div className={`${activeTab == tabs[2] ? 'block' : 'hidden'} w-full h-auto`}>
            {txDisplay && txDisplay.outputs.length > 0 &&
              <div className="px-4 pb-4">
                {txDisplay.type == OutputType.Token &&
                  <TokenOutputs txOutputs={txDisplay.outputs as TokenDisplay[]} />
                }{txDisplay.type == OutputType.Item &&
                  <>n/a</>
                }
              </div>
            }
          </div>
          <div className={`${activeTab == tabs[3] ? 'block' : 'hidden'} w-full h-auto p-4`}>
            <div className="w-full whitespace-pre-wrap">
              {rawData != undefined ? JSON.stringify(rawData, null, '\t') : []}
            </div>
          </div>
        </Card>
        :
        <ErrorBlock msg={IErrorInternal.TxNotFound} />
      }
    </>
  )
}

function Inputs({ txInputs }: { txInputs: InputDisplay[] }) {
  return (
    txInputs.map((input, index) => {
      return (
        <div className="mt-2" key={index}>
          <Typography variant='small' className={`ml-2 ${fira.className}`}>{index + 1}:</Typography>
          <table className='min-w-fit max-w-fit table-auto text-left rounded-sm'>
            <tbody>{/** Transaction Hash */}
              <tr className="border">
                <td className={`${col1}`}>
                  <InformationCircleIcon className={helpIcon} />
                </td>
                <td className={`${col2}`}>
                  <Typography variant='small' className={`font-body text-gray-600`}>
                    {TXS_IN_FIELDS[0]}
                  </Typography>
                </td>
                <td className={`${col3}`}>
                  <Typography variant='paragraph' className={`w-fit ${fira.className} ${input.previousOut != 'n/a' ? 'text-blue-900 hover:underline' : 'text-gray-800'}`}>
                    {input.previousOut}
                  </Typography>
                </td>
              </tr>
              {/** Block Hash */}
              <tr className="border">
                <td className={`${col1}`}>
                  <InformationCircleIcon className={helpIcon} />
                </td>
                <td className={`${col2}`}>
                  <Typography variant='small' className={`font-body text-gray-600`}>
                    {TXS_IN_FIELDS[1]}
                  </Typography>
                </td>
                <td className={`${col3}`}>
                  <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
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
        </div>
      )
    })
  )
}

function TokenOutputs({ txOutputs }: { txOutputs: TokenDisplay[] }) {
  if (txOutputs)
    return (
      txOutputs.map((output, index) => {
        return (
          <div className="mt-2" key={index} >
            <Typography variant='small' className={`ml-2 ${fira.className}`}>{index + 1}:</Typography>
            <table className='w-full min-w-fit table-auto text-left rounded-sm'>
              <tbody>
                {/** Address */}
                <tr className="border">
                  <td className={`${col1}`}>
                    <InformationCircleIcon className={helpIcon} />
                  </td>
                  <td className={`${col2}`}>
                    <Typography variant='small' className={`font-body text-gray-600`}>
                      {TXS_OUT_FIELDS[0]}
                    </Typography>
                  </td>
                  <td className={`${col3}`}>
                    <Typography as={Link} href={`/address/${output.address}`} variant='small' className={`w-fit text-blue-900 ${fira.className} hover:underline`}>
                      {output.address}
                    </Typography>
                  </td>
                </tr>
                {/** Tokens */}
                <tr className="border">
                  <td className={`${col1}`}>
                    <InformationCircleIcon className={helpIcon} />
                  </td>
                  <td className={`${col2}`}>
                    <Typography variant='small' className={`font-body text-gray-600`}>
                      {TXS_OUT_FIELDS[1]}
                    </Typography>
                  </td>
                  <td className={`${col3}`}>
                    <div className="flex align-middle">
                      <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                        {output.tokens}
                      </Typography>
                    </div>
                  </td>
                </tr>
                {/** Fractionated Tokens */}
                <tr className="border">
                  <td className={`${col1}`}>
                    <InformationCircleIcon className={helpIcon} />
                  </td>
                  <td className={`${col2}`}>
                    <Typography variant='small' className={`font-body text-gray-600`}>
                      {TXS_OUT_FIELDS[2]}
                    </Typography>
                  </td>
                  <td className={`${col3}`}>
                    <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                      {output.fractionatedTokens}
                    </Typography>
                  </td>
                </tr>
                {/** LockTime */}
                <tr className="border">
                  <td className={`${col1}`}>
                    <InformationCircleIcon className={helpIcon} />
                  </td>
                  <td className={`${col2}`}>
                    <Typography variant='small' className={`font-body text-gray-600`}>
                      {TXS_OUT_FIELDS[3]}
                    </Typography>
                  </td>
                  <td className={`${col3}`}>
                    <Typography variant='small' className={`w-fit text-gray-800  ${fira.className}`}>
                      {output.lockTime}
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      })
    )
  return []
}

function List({ txInfo }: { txInfo: TransactionDisplay | undefined }) {
  return (
    <table className='w-full min-w-fit table-auto text-left rounded-sm'>
      <tbody>{/** Transaction Hash */}
        <tr className="border-b border-t">
          <td className={`${col1}`}>
            <InformationCircleIcon className={helpIcon} />
          </td>
          <td className={`${col2}`}>
            <Typography variant='small' className={`font-body text-gray-600`}>
              {TXS_FIELDS[0]}
            </Typography>
          </td>
          <td className={`${col3}`}>
            {txInfo != undefined ?
              <Typography as={Link} href={`/transaction/${txInfo.hash}`} target="_blank" variant='small' className={`w-fit text-blue-900 ${fira.className} hover:underline`}>
                {txInfo.hash}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Block Hash */}
        <tr className="border-b border-t">
          <td className={`${col1}`}>
            <InformationCircleIcon className={helpIcon} />
          </td>
          <td className={`${col2}`}>
            <Typography variant='small' className={`font-body text-gray-600`}>
              {TXS_FIELDS[1]}
            </Typography>
          </td>
          <td className={`${col3}`}>
            {txInfo != undefined ?
              <Typography as={Link} href={`/block/${txInfo.bHash}`} variant='small' className={`w-fit text-blue-900 hover:underline ${fira.className}`}>
                {txInfo.bHash}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Block Number */}
        <tr className="border-b border-t">
          <td className={`${col1}`}>
            <InformationCircleIcon className={helpIcon} />
          </td>
          <td className={`${col2}`}>
            <Typography variant='small' className={`font-body text-gray-600`}>
              {TXS_FIELDS[2]}
            </Typography>
          </td>
          <td className={`${col3}`}>
            {txInfo != undefined ?
              <Typography as={Link} href={`/block/${txInfo.bNum}`} variant='small' className={`w-fit text-blue-900 hover:underline ${fira.className}`}>
                {txInfo.bNum}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Transaction type */}
        <tr className="border-b border-t">
          <td className={`${col1}`}>
            <InformationCircleIcon className={helpIcon} />
          </td>
          <td className={`${col2}`}>
            <Typography variant='small' className={`font-body text-gray-600`}>
              {TXS_FIELDS[3]}
            </Typography>
          </td>
          <td className={`${col3}`}>
            {txInfo != undefined &&
              <>
                {txInfo.type == OutputType.Token &&
                  <Typography variant='small' className={`w-fit bg-blue-200 text-blue-900 text-center rounded-sm ${fira.className} px-1`}>
                    {txInfo.type.toUpperCase()}
                  </Typography>
                }
                {txInfo.type == OutputType.Item &&
                  <Typography variant='small' className={`w-fit bg-green-200 text-green-900 text-center rounded-sm ${fira.className} px-1`}>
                    {txInfo.type.toUpperCase()}
                  </Typography>
                }
              </>
            }
            {txInfo == undefined && <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Timestamp*/}
        <tr className="border-t">
          <td className={`${col1}`}>
            <InformationCircleIcon className={helpIcon} />
          </td>
          <td className={`${col2}`}>
            <Typography variant='small' className={`font-body text-gray-600`}>
              {TXS_FIELDS[4]}
            </Typography>
          </td>
          <td className={`${col3}`}>
            {txInfo != undefined ?
              <Typography variant='paragraph' className={`w-fit text-gray-800`}>
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