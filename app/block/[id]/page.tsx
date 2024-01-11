"use client"
import { useEffect, useState } from "react"
import { Card, Typography } from "@material-tailwind/react"
import { fira, ibm } from '@/app/styles/fonts'
import Link from "next/link"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import Table from "@/app/ui/table"
import { isHash, isNum, formatTxTableRows } from "@/app/utils/format"
import { IErrorInternal, ITxRow } from "@/app/interfaces"

const tabs = ['Overview', 'Transactions']
const fields = ['Block Hash', 'Previous Hash', 'Block Number', 'Block Status', 'Timestamp', 'Merkle Root Hash', 'Unicorn Seed', 'Unicorn Witness', 'Byte Size', 'Version']

export default function Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [blockData, setBlockData] = useState(undefined);
  const [blockTxIds, setBlockTxIds] = useState([])
  const [found, setFound] = useState<boolean | undefined>(undefined)
  const [blockHash, setBlockHash] = useState(params.id)

  /// The block information is being pulled here
  useEffect(() => {
    if (isHash(params.id)) { // Is a hash
      fetch(`/api/item/${params.id}`, { // Is a hash
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        if (response.status == 200) {
          const data = await response.json()
          handleFoundBlock(data.content.Block.block)
        } else {
          setFound(false)
        }
      })
    } else if (isNum(params.id)) { // Is a number
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
          if (data.content[0][0]) {
            setBlockHash(data.content[0][0])
            handleFoundBlock(data.content[0][1].block)
          } else {
            setFound(false)
          }
        } else {
          setFound(false)
        }
      })
    } else {
      setFound(false)
    }
  }, []);

  const handleFoundBlock = (block: any) => {
    setBlockData(block.header)
    setBlockTxIds(block.transactions)
    setFound(true)
  }

  return (
    <>
      {found != false &&
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
            <div onClick={() => { if (blockData != undefined) setActiveTab(tabs[1]) }} className={`${activeTab == tabs[1] ? 'font-semibold border-b-2 border-gray-500' : ''} w-auto mx-2 px-2 pt-4 text-xs text-gray-600 border-gray-300 hover:border-b-2 hover:font-semibold hover:cursor-pointer flex flex-row align-middle justify-center `}>
              {tabs[1]} {blockData != undefined && <div className="w-6 h-4 ml-2 bg-gray-300 rounded-t-xl rounded-b-xl"><p className={`w-fit ml-auto mr-auto font-semibold text-xs ${fira.className}`}>{blockTxIds.length}</p></div>}
            </div>
          </div>
          {/** TAB BODIES */}
          <div className={`${activeTab == tabs[0] ? 'block' : 'hidden'} w-full h-auto`}>{/** Overview */}
            <Card className='min-h-fit w-full border-gray-300'>
              <List blockData={blockData} blockHash={blockHash} />
            </Card>
          </div >
          <div className={`${activeTab == tabs[1] ? 'block' : 'hidden'} w-full h-auto`}>{/** Transactions */}
            {blockTxIds.length > 0 && blockData != undefined &&
              <BlockTxs blockTxIds={blockTxIds} activeTab={activeTab} />
            }{blockTxIds.length == 0 &&
              <div className="ml-auto mr-auto p-4 font-thin border-t border-gray-200 shadow-xl bg-white">
                <Typography variant='paragraph' className='font-thin text-gray-800 ml-auto mr-auto py-2 w-fit'>No transactions</Typography>
              </div>
            }
          </div>
        </Card >
      } {
        found == false &&
        <div className="ml-auto mr-auto mt-40 p-4 font-thin border border-gray-200 shadow-xl bg-white rounded-md">
          <Typography variant='paragraph' className='font-thin text-gray-800 '>Error: {IErrorInternal.BlockNotFound}</Typography>
        </div>
      }
    </>
  )
}

function BlockTxs({ blockTxIds, activeTab }: any) {
  const [blockTxs, setBlockTxs] = useState<ITxRow[]>([])

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
    setBlockTxs(content ? formatTxTableRows(content, false) : [])
  }

  return (
    <Table table={{ headers: ["Transaction Hash", "Type", "Status", "Age"], rows: blockTxs }} short={true} />
  )
}

function List({ blockData, blockHash }: any) {
  return (
    <table className='w-full min-w-max table-auto text-left rounded-sm'>
      <tbody>{/** Block Hash */}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[0]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {blockHash}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Previous Hash */}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[1]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {blockData.previous_hash == null ? 'n/a' : blockData.previous_hash}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Block Number */}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[2]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {blockData.b_num}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Block Status */}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[3]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {'UNKNOWN'}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Timestamp*/}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[4]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {'n/a'}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Merkle Root Hash */}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[5]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {blockData.txs_merkle_root_and_hash[1]}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Unicorn Seed */}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[6]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {`${blockData.seed_value[0]}${blockData.seed_value[1]}${blockData.seed_value[2]}${blockData.seed_value[3]}${blockData.seed_value[4]}...`} {/** Create format function in utils */}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Unicorn Witness*/}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[9]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {`${blockData.seed_value[100]}${blockData.seed_value[101]}${blockData.seed_value[102]}${blockData.seed_value[103]}${blockData.seed_value[104]}...`} {/** Create format function in utils */}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Byte Size */}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[7]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {blockData.bits}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
        {/** Version */}
        <tr className="border">
          <td className="pl-6 py-4 w-1/3">
            <Typography variant='small' className={`font-body flex flex-row align-middle justify-start text-gray-600`}>
              <InformationCircleIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-600 hover:cursor-help" />
              {fields[8]}
            </Typography>
          </td>
          <td className="pl-4 py-4 w-2/3">
            {blockData != undefined ?
              <Typography as={Link} href={'#'} variant='small' className={`w-fit text-blue-900 text-xs ${fira.className}`}>
                {blockData.version}
              </Typography>
              :
              <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>}
          </td>
        </tr>
      </tbody>
    </table>
  )
}