import React from 'react'
import { Typography } from '@material-tailwind/react'
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ErrorBlock({ msg }: { msg: string }) {
    return (
        <div className="ml-auto mr-auto mt-40 p-4 font-thin border border-gray-200 shadow-xl bg-white rounded-md flex flex-row justify-between">
            <ExclamationTriangleIcon className="mr-2 h-6 w-6 text-gray-800" />
            <Typography variant='paragraph' className='font-thin text-gray-800'>Error: {msg}</Typography>
        </div>
    )
}