import React from "react"
import { Input } from "@material-tailwind/react"
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline'

export default function Searchbar() {
    return (
        <Input
            disabled
            label="Search"
            icon={<MagnifyingGlassCircleIcon onClick={() => console.log('search')} className="hidden lg:block text-gray-500 hover:text-gray-900 hover:cursor-pointer active:w-4 active:h-4 active:rounded-lg active:text-gray-500" />}
            placeholder="Search"
            className="hidden lg:block max-w-sm !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-200 focus:!border-t-gray-200 focus:ring-gray-900/10"
            labelProps={{
                className: "hidden",
            }}
            containerProps={{ className: "min-w-0" }} />
    )
}