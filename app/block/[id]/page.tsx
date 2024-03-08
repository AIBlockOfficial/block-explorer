"use client"
import { useEffect, useState } from "react"
import { Card, Typography } from "@material-tailwind/react"
import { fira } from '@/app/styles/fonts'
import Link from "next/link"
import { InformationCircleIcon, Square2StackIcon } from "@heroicons/react/24/outline"
import Table, { TableType } from "@/app/ui/table"
import { isHash, isNum, formatToBlockDisplay, timestampElapsedTime, formatTxTableRow, formatToCoinbaseDisplay } from "@/app/utils"
import { BlockDisplay, Coinbase, CoinbaseDisplay, FetchedBlock, IErrorInternal, Transaction, TxRow } from "@/app/interfaces"
import { BLOCK_FIELDS, COINBASE_FIELDS } from "@/app/constants"
import ErrorBlock from "@/app/ui/errorBlock"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/ui/tooltip"

const tabs = ['Overview', 'Transactions', 'Coinbase Transaction']

const col1 = 'pl-2 pr-1 w-5'
const col2 = 'py-4 w-64'
const col3 = 'pl-4 py-4 w-fit'
const helpIcon = 'h-4 w-4 text-gray-600 hover:cursor-help'

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]) // Active tab
  const [blockDisplay, setBlockDisplay] = useState<BlockDisplay | undefined>(undefined) // Block data
  const [txs, setTxs] = useState<TxRow[] | undefined>(undefined) // Block transaction data
  const [found, setFound] = useState<boolean | undefined>(undefined) // If block has been found

  // The block information is being pulled here (and block txs)
  useEffect(() => {
    if (isHash(params.id) || isNum(params.id)) {
      fetch(`/api/block/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json()
        if (data.content) {
          const blockDisplay: BlockDisplay = formatToBlockDisplay(data.content as FetchedBlock)
          setBlockDisplay(blockDisplay)
          setFound(true)
        } else
          setFound(false)
      })

      fetch(`/api/blockTxs/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json()
        if (data.content) {
          const txRows: TxRow[] = data.content.transactions.map((tx: Transaction) => formatTxTableRow(tx))
          setTxs(txRows)
        }
      })
    } else
      setFound(false)
  }, [params.id])

  return (
    <>
      {found == undefined || found ?
        <Card className="mt-6 w-full border border-gray-300 min-w-fit">
          <div className="mb-2 pt-4 pl-5">
            <Typography variant="lead" className="">Block</Typography>
            <Typography variant="small" className="text-gray-600">A block on the AIBlock blockchain</Typography>
          </div>
          {/** TABS */}
          <div className="w-full h-12 pl-2 bg-transparent flex align-bottom justify-start">
            {/** Overview */}
            <div onClick={() => setActiveTab(tabs[0])} className={`${activeTab == tabs[0] ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer`}>
              {tabs[0]}
            </div>
            {/** Transactions */}
            <div onClick={() => { if (blockDisplay != undefined) setActiveTab(tabs[1]) }} className={`${activeTab == tabs[1] ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer flex flex-row align-middle justify-center`}>
              {tabs[1]} {blockDisplay != undefined && txs != undefined && <div className="w-6 h-4 ml-2 bg-gray-300 rounded-t-xl rounded-b-xl"><p className={`w-fit ml-auto mr-auto font-semibold text-xs ${fira.className}`}>{txs.length}</p></div>}
            </div>
            {/** Coinbase Transactions */}
            <div onClick={() => { if (blockDisplay != undefined) setActiveTab(tabs[2]) }} className={`${activeTab == tabs[2] ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer flex flex-row align-middle justify-center`}>
              {tabs[2]}
            </div>
          </div>
          {/** TAB BODIES */}
          {/** Overview */}
          <div className={`${activeTab == tabs[0] ? 'block' : 'hidden'} w-full h-auto`}>
            <Card className='min-h-fit w-full border-gray-300'>
              <List blockInfo={blockDisplay} />
            </Card>
          </div >
          {/** Transactions */}
          <div className={`${activeTab == tabs[1] ? 'block' : 'hidden'} w-full h-auto pb-2`}>
            {blockDisplay != undefined && txs != undefined && txs?.length > 0 &&
              <div className="px-2 pb-2"><Table type={TableType.tx} rows={txs} short={true} /></div>
            }{txs != undefined && txs.length == 0 &&
              <div className="ml-auto mb-4 mr-auto p-4 font-thin border-t border-gray-200 shadow-sm bg-white">
                <Typography variant='paragraph' className='font-thin text-gray-800 ml-auto mr-auto py-2 w-fit'>No transactions</Typography>
              </div>
            }
          </div>
          {/** Coinbase Transaction */}
          <div className={`${activeTab == tabs[2] ? 'block' : 'hidden'} w-full h-auto`}>
            <Card className='min-h-fit w-full border-gray-300'>
              <CoinbaseTx tx={blockDisplay?.miningTxHash} />
            </Card>
          </div >
        </Card >
        :
        <ErrorBlock msg={IErrorInternal.BlockNotFound} />
      }
    </>
  )
}

function List({ blockInfo }: { blockInfo: BlockDisplay | undefined }) {

  return (
    <TooltipProvider delayDuration={100}>
      <table className='w-full min-w-fit table-auto text-left rounded-sm'>
        <tbody>
          {/** Block Hash */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The hash that identifies a block'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body text-gray-600`}>
                {BLOCK_FIELDS[0]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {blockInfo != undefined ?
                <div className="flex flex-row">
                  <Typography as={Link} href={`/block/${blockInfo.hash}`} target="_blank" variant='small' className={`w-fit text-blue-900 ${fira.className} hover:underline`}>
                    {blockInfo.hash}
                  </Typography>
                  <Square2StackIcon className='h-4 w-4 ml-1 text-blue-900 hover:cursor-pointer active:border border-gray-50' onClick={() => navigator.clipboard.writeText(blockInfo.hash)} />
                </div>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Previous Hash */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The hash that identifies the previous block'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body text-gray-600`}>
                {BLOCK_FIELDS[1]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {blockInfo != undefined && blockInfo.previousHash != 'n/a' &&
                <div className="flex flex-row">
                  <Typography as={Link} href={`/block/${blockInfo.previousHash}`} variant='small' className={`w-fit text-blue-900 hover:underline ${fira.className}`}>
                    {blockInfo.previousHash}
                  </Typography>
                  <Square2StackIcon className='h-4 w-4 ml-1 text-blue-900 hover:cursor-pointer active:border border-gray-50' onClick={() => navigator.clipboard.writeText(blockInfo.previousHash)} />
                </div>
              }{blockInfo != undefined && blockInfo.previousHash == 'n/a' && // First block previous hash
                <Typography variant='paragraph' className={`w-fit text-gray-800`}>
                  {blockInfo.previousHash}
                </Typography>
              }{blockInfo == undefined &&
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>
              }
            </td>
          </tr>
          {/** Block Number */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The order of a block'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {BLOCK_FIELDS[2]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {blockInfo != undefined ?
                <Typography as={Link} href={`/block/${blockInfo.bNum}`} target="_blank" variant='paragraph' className={`w-fit text-blue-900 ${fira.className} hover:underline`}>
                  {blockInfo.bNum}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Timestamp*/}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The time and date when a block was constructed'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {BLOCK_FIELDS[3]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {blockInfo != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 `}>
                  {new Date(blockInfo.timestamp).toString() + ' ' + timestampElapsedTime(blockInfo.timestamp)}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Merkle Root Hash */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The merkle root hash of all transactions in the block'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {BLOCK_FIELDS[4]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {blockInfo != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                  {blockInfo.merkleRootHash}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Unicorn Seed */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The seed value, used as input in the RNG process'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {BLOCK_FIELDS[5]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {blockInfo != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                  {blockInfo.unicornSeed}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Unicorn Witness*/}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {"The witness value, used to quickly verify the RNG process's fairness"}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {BLOCK_FIELDS[6]}
              </Typography>
            </td>
            <td className={`${col3} pr-2`}>
              {blockInfo != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                  {blockInfo.unicornWitness}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Byte Size */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The size in Bytes of a block'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {BLOCK_FIELDS[7]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {blockInfo != undefined ?
                <div className="flex align-middle">
                  <Typography variant='paragraph' className={`w-fit text-gray-800 ${fira.className}`}>
                    {blockInfo.byteSize.split(' ')[0]}
                  </Typography>
                  <Typography variant='paragraph' className={`w-fit text-gray-800 pl-1`}>
                    {blockInfo.byteSize.split(' ')[1]}
                  </Typography>
                </div>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Version */}
          <tr className="border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The version of the block'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {BLOCK_FIELDS[8]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {blockInfo != undefined ?
                <Typography variant='paragraph' className={`w-fit text-gray-800 ${fira.className}`}>
                  {blockInfo.version}
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

// Needs cleanup, quick implementation
function CoinbaseTx({ tx }: { tx: string | undefined }) {

  const [coinbaseTx, setCoinbaseTx] = useState<CoinbaseDisplay | undefined>(undefined)

  useEffect(() => {
    if (tx != undefined) {
      fetch(`/api/item/${tx}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json()
        if (data.content) {
          const coinbaseDisplay: CoinbaseDisplay = formatToCoinbaseDisplay(data.content.Transaction as Coinbase)
          setCoinbaseTx(coinbaseDisplay)
        }
      })
    }
  }, [tx])

  return (
    <TooltipProvider delayDuration={100}>
      <table className='w-full min-w-fit table-auto text-left rounded-sm'>
        <tbody>
          {/** Coinbase Hash */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'Coinbase transaction hash'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {COINBASE_FIELDS[0]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {coinbaseTx != undefined ?
                <Typography as={Link} href={`/block/${tx}`} target="_blank" variant='paragraph' className={`w-fit text-blue-900 ${fira.className} hover:underline`}>
                  {tx}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Token Reward */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'Miner reward'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {COINBASE_FIELDS[1]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {coinbaseTx != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                  {coinbaseTx.tokens}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Fractionnated Token Reward*/}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'Miner reward in fracionated tokens'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {COINBASE_FIELDS[2]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {coinbaseTx != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                  {coinbaseTx.fractionatedTokens}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Version */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The version of the transaction'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {COINBASE_FIELDS[3]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {coinbaseTx != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                  {coinbaseTx.version}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Script Public Key */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'Address of winning miner'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {COINBASE_FIELDS[4]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {coinbaseTx != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                  {coinbaseTx.scriptPubKey}
                </Typography>
                :
                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
            </td>
          </tr>
          {/** Locktime */}
          <tr className="border-b border-t">
            <td className={`${col1}`}>
              <Tooltip>
                <TooltipTrigger><InformationCircleIcon className={helpIcon} /></TooltipTrigger>
                <TooltipContent>
                  {'The amount of time necessary for the transaction to be onspent'}
                </TooltipContent>
              </Tooltip>
            </td>
            <td className={`${col2}`}>
              <Typography variant='small' className={`font-body  text-gray-600`}>
                {COINBASE_FIELDS[5]}
              </Typography>
            </td>
            <td className={`${col3}`}>
              {coinbaseTx != undefined ?
                <Typography variant='small' className={`w-fit text-gray-800 ${fira.className}`}>
                  {coinbaseTx.locktime}
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