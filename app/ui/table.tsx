import React, { useState } from 'react'
import Link from 'next/link'
import { shortenHash, timestampElapsedTime } from '@/app/utils'
import { BlockRow, TxRow } from '@/app/interfaces'
import { Card, Typography } from '@material-tailwind/react'
import { ChevronDownIcon, ChevronUpIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { fira } from '@/app/styles/fonts'
import { BLOCK_TABLE_HEADERS, ITEMS_PER_CHUNK, ITEMS_PER_PAGE_SHORT, TXS_TABLE_HEADERS } from '@/app/constants'

export enum TableType {
    block = 'block',
    tx = 'tx'
}
const row_spacing = `px-4 py-3`

/**
 * Table header
 */
function Headers({ headers, short }: { headers: string[], short?: boolean }) {
    const [reversed, setReversed] = useState(short)
    
    let result: JSX.Element[] = []
    headers.map((head, i) => {
        result.push(
            <th key={head}
                className={
                    `border-b border-gray-200 bg-gray-100 p-4
            ${i == 0 ? 'rounded-tl-sm' : ''} 
            ${i == headers.length - 1 ? 'rounded-tr-sm flex flex-row' : ''}`
                }>
                <Typography
                    variant='small'
                    className='font-bold leading-none opacity-70 text-black'
                >
                    {head}
                </Typography>

                {!short && i == headers.length - 1 &&
                    <div className='ml-4'>
                        {!reversed &&
                            <ChevronDownIcon onClick={() => setReversed(!reversed)} className="h-4 w-4 text-gray-500 bg-gray-300 rounded-sm hover:cursor-pointer" />
                        }
                        {reversed &&
                            <ChevronUpIcon onClick={() => setReversed(!reversed)} className="h-4 w-4 text-gray-500 bg-gray-300 rounded-sm hover:cursor-pointer" />
                        }
                    </div>
                }
            </th>
        )
    })
    return result
}

/**
 * Block table for BlockRow
 */
function BlockTable({ rows }: { rows: BlockRow[] }) {
    let result: JSX.Element[] = []
    rows.map(({ number, blockHash, previousHash, nbTx, age }: BlockRow, index) => {
        result.push(
            <tr key={index} className={`${index == rows.length - 1 ? '' : 'border-b border-b-gray-200'}`}>
                <td className={row_spacing}>
                    <Typography as={Link} href={`/block/${number}`} variant='small' className={`text-blue-900 text-xs ${fira.className}`}>
                        {number}
                    </Typography>
                </td>
                <td className={`${row_spacing}`}>
                    <div className='flex flex-row'>
                        <Typography as={Link} href={`/block/${blockHash}`} variant='small' className={`text-blue-900 text-xs ${fira.className} hover:underline`}>
                            {shortenHash(blockHash)}
                        </Typography>
                        <Square2StackIcon className='text-blue-900 h-4 w-4 hover:cursor-pointer active:border border-gray-50' onClick={() => navigator.clipboard.writeText(blockHash)} />
                    </div>
                </td>
                <td className={`${row_spacing}`}>
                    {previousHash && // First block has no previous hash
                        <div className='flex flex-row'>
                            <Typography as={Link} href={`/block/${previousHash}`} variant='small' className={`text-blue-900 text-xs ${fira.className} hover:underline`}>
                                {shortenHash(previousHash)}
                            </Typography>
                            <Square2StackIcon className='text-blue-900 h-4 w-4 hover:cursor-pointer active:border border-gray-50' onClick={() => navigator.clipboard.writeText(previousHash)} />
                        </div>
                    }
                </td>
                <td className={row_spacing}>
                    <Typography variant='small' className={`w-1/2 text-center ${nbTx == '0' ? 'text-red-900 bg-red-200' : 'text-purple-900 bg-purple-200'} rounded-sm ${fira.className} px-1 w-[40px]`}>
                        {nbTx == '0' ? 'NONE' : nbTx}
                    </Typography>
                </td>
                <td className={row_spacing}>
                    <Typography variant='small' className={`text-gray-500`}>
                        {timestampElapsedTime(age)}
                    </Typography>
                </td>
            </tr >
        )
    })
    return result
}

/**
 * Transaction table for TxRow
 */
function TxTable({ rows }: { rows: TxRow[] }) {
    let result: JSX.Element[] = []
    rows.map(({ txHash, blockHash, type, age }: TxRow, index) => {
        result.push(
            <tr key={index} className={`${index == rows.length - 1 ? '' : 'border-b border-b-gray-200'}`}>
                <td className={`${row_spacing}`}>
                    <div className='flex flex-row'>
                        <Typography as={Link} href={`/transaction/${txHash}`} variant='small' className={`text-blue-900 text-xs ${fira.className} hover:underline`}>
                            {txHash != undefined && txHash.length > 6 ? shortenHash(txHash) : txHash}
                        </Typography>
                        <Square2StackIcon className='h-4 w-4 text-blue-900 hover:cursor-pointer active:border border-gray-50' onClick={() => navigator.clipboard.writeText(txHash)} />
                    </div>
                </td>
                <td className={`${row_spacing}`}>
                    <div className='flex flex-row'>
                        <Typography as={Link} href={`/block/${blockHash}`} variant='small' className={`text-blue-900 text-xs ${fira.className} hover:underline`}>
                            {shortenHash(blockHash)}
                        </Typography>
                        <Square2StackIcon className='h-4 w-4 text-blue-900 hover:cursor-pointer active:border border-gray-50' onClick={() => navigator.clipboard.writeText(blockHash)} />
                    </div>
                </td>
                <td className={row_spacing}>
                    <Typography variant='small' className={`w-fit ${type == 'token' ? 'bg-green-200 text-green-900' : ''} ${type == 'item' ? ' bg-blue-200 text-blue-900' : ''} text-center rounded-sm ${fira.className} px-1`}>
                        {type.toUpperCase()}
                    </Typography>
                </td>
                <td className={row_spacing}>
                    <Typography variant='small' className={`text-gray-500`}>
                        {timestampElapsedTime(age)}
                    </Typography>
                </td>
            </tr>
        )
    })
    return result
}

/**
 * Loading table skeleton
 */
function LoadingTable({ rows, cols }: { rows: number, cols: number }) {
    let result: JSX.Element[] = []
    for (let i = 0; i < rows; i++) {
        let line: JSX.Element[] = []
        for (let j = 0; j < cols; j++) {
            line.push(
                <td key={j} className={row_spacing}>
                    <div className="h-5 mx-1 rounded bg-gray-200 animate-pulse "></div>
                </td>)
        }
        let a = (
            <tr key={i} className={`${i == rows - 1 ? '' : 'border-b border-b-gray-200'}`}>
                {...line}
            </tr>
        )
        result.push(a)
    }
    return result
}

/**
 * Table component for displaying blocks and transactions
 */
export default function Table({ rows, type, short }: { rows: BlockRow[] | TxRow[], type: TableType, short?: boolean }) {
    return (
        <Card className='min-h-fit min-w-fit w-full shadow-md rounded-sm border border-gray-300 mt-2'>
            <table className='w-full min-w-max table-auto text-left rounded-sm'>
                <thead>
                    <tr>
                        {type == TableType.block &&
                            <Headers headers={BLOCK_TABLE_HEADERS} short={short} />
                        }
                        {type == TableType.tx &&
                            <Headers headers={TXS_TABLE_HEADERS} short={short} />
                        }
                    </tr>
                </thead>
                <tbody>
                    {type == TableType.block &&
                        <>
                            <BlockTable rows={rows as BlockRow[]} />
                            {!short && rows.length > 0 && (rows[rows.length - 1] as BlockRow).number != '0' &&
                                <LoadingTable rows={5} cols={BLOCK_TABLE_HEADERS.length} />
                            }
                        </>
                    }
                    {type == TableType.tx &&
                        <>
                            <TxTable rows={rows as TxRow[]} />
                            {!short && rows.length > 0 && (rows[rows.length - 1] as TxRow).txHash != '000000' && (rows[rows.length - 1] as TxRow).txHash != '000010' && (rows[rows.length - 1] as TxRow).txHash != '000001' && (rows[rows.length - 1] as TxRow).txHash != '000011' &&
                                <LoadingTable rows={5} cols={TXS_TABLE_HEADERS.length} />
                            }
                        </>
                    }
                    {(rows.length < 1 && type == TableType.block) &&
                        <LoadingTable rows={short ? ITEMS_PER_PAGE_SHORT : ITEMS_PER_CHUNK} cols={BLOCK_TABLE_HEADERS.length} />
                    }

                    {(rows.length < 1 && type == TableType.tx) &&
                        <LoadingTable rows={short ? ITEMS_PER_PAGE_SHORT : ITEMS_PER_CHUNK} cols={TXS_TABLE_HEADERS.length} />
                    }
                </tbody>
            </table>
        </Card>
    )
}