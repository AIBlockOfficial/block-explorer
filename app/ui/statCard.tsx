import React from 'react'
import { formatNumber } from '@/app/utils'
import { Card, Typography } from "@material-tailwind/react"
import { ibm } from '../styles/fonts'

interface IProps {
    title: string,
    value?: number,
    icon: JSX.Element,
    href?: string,
}

export default function StatCard({ title, value, icon, href }: IProps) {
    return (
        <Card className="min-h-fit min-w-[250px] w-full shadow-xl rounded-md border border-gray-200 mt-2">
            <div className='px-8 py-4 flex items-center justify-start'>
                {icon}
                <div className='h-16 w-full ml-8'>
                    <Typography variant='small' className='font-bold text-gray-600'>{title}</Typography>
                    {value ?
                        <Typography variant='lead' className={`mt-1 text-black ${ibm.className}`}>{formatNumber(value)}</Typography>
                        :
                        <div className="mt-2 h-6 w-32 rounded bg-gray-200 animate-pulse"></div>}
                </div>
            </div>
            <div className='w-full h-14 mt-auto pl-5 rounded-b-md bg-gray-100 flex items-center justify-start'>
                {href &&
                    <Typography as='a' href={href} variant='small' className='font-bold text-light-blue-900 hover:underline'>View all</Typography>
                }
            </div>
        </Card>
    )
}