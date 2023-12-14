"use client"
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"

export default function NotFound() {
    let router = useRouter()
    return (
        <div className='w-full flex flex-col align-middle justify-center pt-24'>
            <div className='flex flex-row m-auto'>
                <ExclamationCircleIcon className="h-8 w-8 mr-4 mt-1 text-gray-500" />
                <h1 className=' text-gray-500 font-extralight text-4xl'>404 not found</h1>
            </div>
            <Button className='w-fit m-auto mt-6' onClick={() => router.push('/')}>Return Home</Button>
        </div>
    )
}