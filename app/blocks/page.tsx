'use client'
import React, { useEffect, useState } from "react"
import Table, { TableType } from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { formatBlockTableRow } from "../utils"
import { Block, BlockRow } from "@/app/interfaces"
import useScrollPosition from "../hooks/useScrollPosition"
import { ITEMS_PER_CHUNK } from "../constants"

export default function Page() {
  // const [reversed, setReversed] = useState<boolean>(true); // Revers table order
  const [expandCounter, setExpandCounter] = useState<number>(0) // Auto expand table as page is scrolled
  const [latestBlockNum, setLatestBlockNum] = useState<number>(); // Serves as end value for blocks fetch scope
  const [blocksData, setBlocksData] = useState<BlockRow[]>([]); // Blocks data list
  const scroll = useScrollPosition() // Scroll position hook

  useEffect(() => { // Auto expand feature. Can be improved but works well for now.
    if (scroll > (window.innerHeight / 2) * expandCounter) {
      expand()
    }
  }, [scroll])

  useEffect(() => {
    fetch(`api/blocks?limit=${ITEMS_PER_CHUNK}&offset=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      if (data.content) {
        setLatestBlockNum(data.content.pagination.total)
        const blocksRows: BlockRow[] = await Promise.all(await data.content.blocks.map(async (block: Block) => await formatBlockTableRow(block))) // Currently used await because nb tx of each block is fetched
        setBlocksData(blocksRows)
      }
    })
  }, []);

  // Expand table items by ITEMS_PER_CHUNK (triggers when scroll is at a certain height on page)
  async function expand() {
    if (latestBlockNum) {
      fetch(`api/blocks?limit=${ITEMS_PER_CHUNK}&offset=${ITEMS_PER_CHUNK * expandCounter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json()
        if (data.content) {
          let existing = blocksData;
          const blocksRows: BlockRow[] = await Promise.all(await data.content.blocks.map(async (block: Block) => await formatBlockTableRow(block))) // Currently used await because nb tx of each block is fetched
          setBlocksData([...existing, ...blocksRows])
        }
      })
      setExpandCounter(expandCounter + 1)
    }
  }

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Blocks</Typography>
        <Typography variant="small" className="text-gray-600">Blocks on the A-Block blockchain</Typography>
      </div>
      {/* {blocksData.length > 0 && <Button className="w-fit h-fit" onClick={() => { setReversed(!reversed); setExpandCounter(0) }}>Order</Button>} */}
      <Table rows={blocksData} type={TableType.block} />
    </>
  )
}