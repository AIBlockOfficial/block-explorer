"use client"
import { useEffect, useState } from "react"
import { Card, Typography } from "@material-tailwind/react"
import { fira } from '@/app/styles/fonts'
import Link from "next/link"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import Table from "@/app/ui/table"
import { isHash, isNum, formatTxTableRows, formatToBlockDisplay } from "@/app/utils"
import { BlockData, BlockDisplay, BlockItem, BlockResult, IErrorInternal, TxRow } from "@/app/interfaces"
import { BLOCK_FIELDS } from "@/app/constants"
import ErrorBlock from "@/app/ui/errorBlock"

const tabs = ['Overview', 'Transactions']

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [blockDisplay, setBlockDisplay] = useState<BlockDisplay | undefined>(undefined);
  const [blockTxIds, setBlockTxIds] = useState<string[]>([])
  const [found, setFound] = useState<boolean | undefined>(undefined)

  /// The block information is being pulled here
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
          setBlockTxIds((data.content as BlockItem).Block.block.transactions)
          const blockDisplay: BlockDisplay = formatToBlockDisplay([params.id, data.content.Block] as BlockResult)
          setBlockDisplay(blockDisplay)
          setFound(true)
        } else {
          setFound(false)
        }
      })
    } else if (isNum(params.id)) { // is a number
      fetch(`/api/blocks`, {
        method: 'POST',
        body: JSON.stringify([params.id]),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        if (response.status == 200) {
          const data = await response.json()
          // if a bnum that doesn't exist is used, the result is successful and returns an empty value.
          if (data.content[0][0] as BlockResult) {
            setBlockTxIds((data.content[0][1] as BlockData).block.transactions)
            const blockDisplay = formatToBlockDisplay(data.content[0] as BlockResult);
            setBlockDisplay(blockDisplay)
            setFound(true)
          } else {
            setFound(false)
          }
        } else { // did not pass format verification, therfore should not exist on chain
          setFound(false)
        }
      })
    } else {
      setFound(false)
    }
  }, []);

  return (
    <>
      {found == undefined || found ?
        <Card className="mt-6 w-full border border-gray-300 min-w-fit">
          <div className="mb-2 pt-4 pl-5">
            <Typography variant="lead" className="">Block</Typography>
            <Typography variant="small" className="text-gray-600">A block on the A-Block blockchain</Typography>
          </div>
          {/** TABS */}
          <div className="w-full h-12 pl-2 bg-transparent flex align-bottom justify-start">
            {/** Overview */}
            <div onClick={() => setActiveTab(tabs[0])} className={`${activeTab == tabs[0] ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer`}>
              {tabs[0]}
            </div>
            {/** Transactions */}
            <div onClick={() => { if (blockDisplay != undefined) setActiveTab(tabs[1]) }} className={`${activeTab == tabs[1] ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer flex flex-row align-middle justify-center`}>
              {tabs[1]} {blockDisplay != undefined && <div className="w-6 h-4 ml-2 bg-gray-300 rounded-t-xl rounded-b-xl"><p className={`w-fit ml-auto mr-auto font-semibold text-xs ${fira.className}`}>{blockTxIds.length}</p></div>}
            </div>
          </div>
          {/** TAB BODIES */}
          <div className={`${activeTab == tabs[0] ? 'block' : 'hidden'} w-full h-auto`}>{/** Overview */}
            <Card className='min-h-fit w-full border-gray-300'>
              <List blockInfo={blockDisplay} />
            </Card>
          </div >
          {/** Transactions */}
          <div className={`${activeTab == tabs[1] ? 'block' : 'hidden'} w-full h-auto pb-2`}>
            {blockTxIds.length > 0 && blockDisplay != undefined &&
              <BlockTxs blockTxIds={blockTxIds} activeTab={activeTab} />
            }{blockTxIds.length == 0 &&
              <div className="ml-auto mr-auto p-4 font-thin border-t border-gray-200 shadow-xl bg-white">
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

function BlockTxs({ blockTxIds, activeTab }: any) {
  const [blockTxs, setBlockTxs] = useState<TxRow[]>([])

  useEffect(() => {
    if (blockTxs.length < 1 && activeTab == tabs[1])
      handleBlockTxs(blockTxIds)
  }, [activeTab])

  const handleBlockTxs = async (txs: string[]) => {
    let content: any = [];
    for (const tx of txs) {
      await fetch(`/api/item/${tx}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        if (response.status == 200) {
          let data = await response.json()
          content.push([tx, data.content.Transaction])
        }
      })
    }
    setBlockTxs(content ? formatTxTableRows(content, true) : [])
  }

  return (
    <Table table={{ headers: ["Transaction Hash", "Type", "Status", "Age"], rows: blockTxs }} short={true} />
  )
}

function List({ blockInfo }: { blockInfo: BlockDisplay | undefined }) {
  const col1 = 'pl-2 pr-1 w-5'
  const col2 = 'py-4 w-64'
  const col3 = 'pl-4 py-4 w-fit'
  const helpIcon = 'h-4 w-4 text-gray-600 hover:cursor-help'

  return (
    <table className='w-full min-w-fit table-auto text-left rounded-sm'>
      <tbody>
        {/** Block Hash */}
        <tr className="border-b border-t">
          <td className={`${col1}`}>
            <InformationCircleIcon className={helpIcon} />
          </td>
          <td className={`${col2}`}>
            <Typography variant='small' className={`font-body text-gray-600`}>
              {BLOCK_FIELDS[0]}
            </Typography>
          </td>
          <td className={`${col3}`}>
            {blockInfo != undefined ?
              <Typography as={Link} href={`/block/${blockInfo.hash}`} target="_blank" variant='small' className={`w-fit text-blue-900 ${fira.className} hover:underline`}>
                {blockInfo.hash}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Previous Hash */}
        <tr className="border-b border-t">
          <td className={`${col1}`}>
            <InformationCircleIcon className={helpIcon} />
          </td>
          <td className={`${col2}`}>
            <Typography variant='small' className={`font-body text-gray-600`}>
              {BLOCK_FIELDS[1]}
            </Typography>
          </td>
          <td className={`${col3}`}>
            {blockInfo != undefined && blockInfo.previousHash != 'n/a' &&
              <Typography as={Link} href={`/block/${blockInfo.previousHash}`} variant='small' className={`w-fit text-blue-900 hover:underline ${fira.className}`}>
                {blockInfo.previousHash}
              </Typography>
            }{blockInfo != undefined && blockInfo.previousHash == 'n/a' &&
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
            <InformationCircleIcon className={helpIcon} />
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
            <InformationCircleIcon className={helpIcon} />
          </td>
          <td className={`${col2}`}>
            <Typography variant='small' className={`font-body  text-gray-600`}>
              {BLOCK_FIELDS[3]}
            </Typography>
          </td>
          <td className={`${col3}`}>
            {blockInfo != undefined ?
              <Typography variant='paragraph' className={`w-fit text-gray-800`}>
                {'n/a'}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Merkle Root Hash */}
        <tr className="border-b border-t">
          <td className={`${col1}`}>
            <InformationCircleIcon className={helpIcon} />
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
            <InformationCircleIcon className={helpIcon} />
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
            <InformationCircleIcon className={helpIcon} />
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
            <InformationCircleIcon className={helpIcon} />
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
            <InformationCircleIcon className={helpIcon} />
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
  )
}