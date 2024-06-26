'use client'
import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation'
import { Input } from "@material-tailwind/react"
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline'
import { isGenesisTx, isHash, isNum } from "@/app/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/app/ui/tooltip"

export default function Searchbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [input, setInput] = useState<string>('')
    const [displayAlert, setDisplayAlert] = useState<boolean>(false)

    // Reset input content on page change
    useEffect(() => {
        setInput('')
    }, [pathname])

    // Keypress handler to validate input on 'Enter' keypress
    const handleKeyDown = (e: any) => {
        if (e.key == 'Enter') {
            search()
        }
    }

    /**
     * Search funtion for block hash, block number, and transaction hash
     */
    const search = () => {
        setDisplayAlert(false)
        if (isHash(input)) {
            if (input[0] == 'b') // block hash
                router.push(`/block/${input}`)
            else if (input[0] == 'g') // tx hash
                router.push(`/transaction/${input}`)
            else
            router.push(`/address/${input}`)
        } else if (isNum(input))
            router.push(`/block/${input}`)
        else if (isGenesisTx(input))
            router.push(`/transaction/${input}`)
        else {
            setDisplayAlert(true)
            setTimeout(() => setDisplayAlert(false), 10000)
        }
    }

    /**
     * Alert for input feedback
     */
    function Alert() {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 w-[450px] px-4 py-3 rounded fixed left-5 bottom-5 z-50" role="alert">
                <strong className="font-bold">Wrong format</strong>
                <span className="block sm:inline px-2">Your input is not a hash or a number</span>
                <span className="absolute top-0 right-0">
                    <svg onClick={() => setDisplayAlert(false)} className="fill-current h-4 w-4 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                </span>
            </div>
        )
    }

    return (
        <>
            {displayAlert &&
                <Alert />
            }
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger>
                        <Input
                            label="Search"
                            icon={<MagnifyingGlassCircleIcon onClick={() => search()} className="hidden lg:block text-gray-500 hover:text-gray-900 hover:cursor-pointer active:w-4 active:h-4 active:rounded-lg active:text-gray-500" />}
                            placeholder="Search"
                            value={input}
                            className="hidden lg:block max-w-sm !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-200 focus:!border-t-gray-200 focus:ring-gray-900/10"
                            labelProps={{
                                className: "hidden",
                            }}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            containerProps={{ className: "min-w-0" }} />
                    </TooltipTrigger>
                    <TooltipContent>
                        {'Search Blocks, Transactions or Addresses.'}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider >
        </>
    )
}

{/* <TooltipProvider delayDuration={100}>
<Tooltip>
  <TooltipTrigger><InformationCircleIcon className={'h-4 w-4  text-green-900 hover:cursor-help'} /></TooltipTrigger>
  <TooltipContent>
    {'Currently on Testnet. Mainnet is not available at this time.'}
  </TooltipContent>
</Tooltip>
</TooltipProvider>
<Typography variant='small' className={`w-fit text-green-900 text-center ${fira.className} px-1`}>
{"Testnet".toUpperCase()}
</Typography> */}