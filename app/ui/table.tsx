import React from 'react'
import Link from 'next/link'
import { shortenHash, timestampElapsedTime } from '@/app/utils'
import { ITable, BlockRow, TxRow } from '@/app/interfaces'
import { Card, Typography } from '@material-tailwind/react'
import { Square2StackIcon } from '@heroicons/react/24/outline'
import { fira } from '@/app/styles/fonts'
import { BLOCK_TABLE_HEADERS, BLOCK_TABLE_HEADERS_SHORT, ITEMS_PER_CHUNK, ITEMS_PER_PAGE_SHORT, TXS_TABLE_HEADERS, TXS_TABLE_HEADERS_SHORT } from '@/app/constants'

export enum TableType {
    block = 'block',
    tx = 'tx'
}

const row_spacing = `px-4 py-3`

function Headers({ headers }: { headers: string[] }) {
    let result: JSX.Element[] = []
    headers.map((head, i) => {
        result.push(
            <th key={head}
                className={
                    `border-b border-gray-200 bg-gray-100 p-4
            ${i == 0 ? 'rounded-tl-sm' : ''} 
            ${i == headers.length - 1 ? 'rounded-tr-sm' : ''}`
                }>
                <Typography
                    variant='small'
                    className='font-bold leading-none opacity-70 text-black'
                >
                    {head}
                </Typography>
            </th>
        )
    })
    return result
}

function BlockTable({ rows, short = false }: { rows: BlockRow[], short?: boolean }) {
    let result: JSX.Element[] = []
    rows.map(({ number, blockHash, nbTx, age }: BlockRow, index) => {
        result.push(
            <tr key={index} className={`${index == rows.length - 1 ? '' : 'border-b border-b-gray-200'}`}>
                <td className={row_spacing}>
                    <Typography as={Link} href={`/block/${number}`} variant='small' className={`text-blue-900 text-xs ${fira.className}`}>
                        {number}
                    </Typography>
                </td>
                <td className={`${row_spacing} flex flex-row`}>
                    <Typography as={Link} href={`/block/${blockHash}`} variant='small' className={`text-blue-900 text-xs ${fira.className} hover:underline`}>
                        {shortenHash(blockHash)}
                    </Typography>
                    <Square2StackIcon className='text-blue-900 h-4 w-4 hover:cursor-pointer' onClick={() => null} />
                </td>
                <td className={row_spacing}>
                    <Typography variant='small' className={`w-1/2 text-center`}>
                        {nbTx}
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

function TxTable({ rows, short = false }: { rows: TxRow[], short?: boolean }) {
    let result: JSX.Element[] = []
    rows.map(({ txHash, blockHash, type, age }: TxRow, index) => {
        result.push(
            <tr key={index} className={`${index == rows.length - 1 ? '' : 'border-b border-b-gray-200'}`}>
                <td className={`${row_spacing} flex flex-row`}>
                    <Typography as={Link} href={`/transaction/${txHash}`} variant='small' className={`text-blue-900 text-xs ${fira.className} hover:underline`}>
                        {txHash.length > 6 ? shortenHash(txHash) : txHash}
                    </Typography>
                    <Square2StackIcon className='h-4 w-4 text-blue-900 hover:cursor-pointer' />
                </td>
                <td className={`${row_spacing}`}>
                    <Typography as={Link} href={`/block/${blockHash}`} variant='small' className={`text-blue-900 text-xs ${fira.className} hover:underline`}>
                        {shortenHash(blockHash)}
                    </Typography>
                </td>
                <td className={row_spacing}>
                    <Typography variant='small' className={`w-fit ${type == 'token' ? 'bg-green-200 text-green-900' : ''} ${type == 'receipt' ? ' bg-blue-200 text-blue-900' : ''}  text-center rounded-sm ${fira.className} px-1`}>
                        {type == 'receipt' ? 'ITEM' : type.toUpperCase()}
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
        <Card className='min-h-fit w-full shadow-md rounded-sm border border-gray-300 mt-2'>
            <table className='w-full min-w-max table-auto text-left rounded-sm'>
                <thead>
                    <tr>
                        {(type == TableType.block && short) &&
                            <Headers headers={BLOCK_TABLE_HEADERS_SHORT} />
                        }
                        {(type == TableType.block && !short) &&
                            <Headers headers={BLOCK_TABLE_HEADERS} />
                        }
                        {(type == TableType.tx && short) &&
                            <Headers headers={TXS_TABLE_HEADERS_SHORT} />
                        }
                        {(type == TableType.tx && !short) &&
                            <Headers headers={TXS_TABLE_HEADERS} />
                        }
                    </tr>
                </thead>
                <tbody>
                    {type == TableType.block &&
                        <BlockTable rows={rows as BlockRow[]} short={short} />
                    }
                    {type == TableType.tx &&
                        <TxTable rows={rows as TxRow[]} short={short} />
                    }
                    {(rows.length < 1 && type == TableType.block) &&
                        <LoadingTable rows={short ? ITEMS_PER_PAGE_SHORT : ITEMS_PER_CHUNK} cols={short ? BLOCK_TABLE_HEADERS_SHORT.length : BLOCK_TABLE_HEADERS.length} />
                    }

                    {(rows.length < 1 && type == TableType.tx) &&
                        <LoadingTable rows={short ? ITEMS_PER_PAGE_SHORT : ITEMS_PER_CHUNK} cols={short ? TXS_TABLE_HEADERS_SHORT.length : TXS_TABLE_HEADERS.length} />
                    }
                </tbody>
            </table>
        </Card>
    )
}