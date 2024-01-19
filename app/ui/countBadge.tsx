import React from 'react'
import { fira } from '@/app/styles/fonts'

export function CountBadge({ count }: { count: string }) {
    return (
        <div className="w-6 h-4 ml-2 bg-gray-300 rounded-t-xl rounded-b-xl">
            <p className={`w-fit ml-auto mr-auto font-semibold text-xs ${fira.className}`}>
                {count}
            </p>
        </div>
    )
}
