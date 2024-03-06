'use client'
import React, { useEffect, useState } from "react"
import Table, { TableType } from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { formatBlockTableRow } from "../utils"
import { Block, BlockRow } from "@/app/interfaces"
import useScrollPosition from "../hooks/useScrollPosition"
import { ITEMS_PER_CHUNK } from "../constants"

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true) // Prevent fetching when loading
  const [latestBlockNum, setLatestBlockNum] = useState<number>() // Serves as end value for blocks fetch scope
  const [blocksData, setBlocksData] = useState<BlockRow[]>([]) // Blocks data list
  const [expandCounter, setExpandCounter] = useState<number>(1) // Auto expand table as page is scrolled
  const [reversed, setReverse] = useState<boolean>(false)
  const reverseFilter = { reverse: reversed, setReverse };
  const [container, setContainer] = useState<HTMLElement | null>(null) // used to calculate scroll height
  const scroll = useScrollPosition() // Scroll position hook

  // List of blocks is being pulled here
  useEffect(() => {
    setContainer(document.getElementById('html')) // Set scroll container
    fetch(`api/blocks?limit=${ITEMS_PER_CHUNK}&offset=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      if (data.content) {
        setLatestBlockNum(data.content.pagination.total)
        const blocksRows: BlockRow[] = data.content.blocks.map((block: Block) => formatBlockTableRow(block))
        setBlocksData(blocksRows)
        setLoading(false)
      }
    })
  }, [])

  // Expand table items by ITEMS_PER_CHUNK (triggers when scroll is at a certain height on page)
  useEffect(() => {
    if (!loading && container && latestBlockNum) {
      if (scroll > (container.scrollHeight - container.clientHeight) - 200) {
        const offset = (ITEMS_PER_CHUNK * expandCounter) < (latestBlockNum) ? (ITEMS_PER_CHUNK * expandCounter) : ((ITEMS_PER_CHUNK * expandCounter) - (latestBlockNum - (ITEMS_PER_CHUNK * expandCounter)))
        setLoading(true)
        fetch(`api/blocks?limit=${ITEMS_PER_CHUNK}&offset=${offset}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(async response => {
          const data = await response.json()
          if (data.content) {
            let existing = blocksData
            const blocksRows: BlockRow[] = data.content.blocks.map((block: Block) => formatBlockTableRow(block))
            setBlocksData([...existing, ...blocksRows])
            setExpandCounter(expandCounter + 1)
            setLoading(false)
          }
        })
      }
    }
    // eslint-disable-next-line 
  }, [scroll]) // This is NOT a good implementation of useEffect. Must be changed /!\ (react-hooks/exhaustive-deps)

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Blocks</Typography>
        <Typography variant="small" className="text-gray-600">Blocks on the AIBlock blockchain</Typography>
      </div>
      <Table rows={blocksData} type={TableType.block} />
    </>
  )
}