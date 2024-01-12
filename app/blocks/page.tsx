'use client'
import React, { useEffect, useState } from "react"
import Table from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { getRange, formatBlockTableRows, formatBlockData } from "../utils"
import { BLOCK_HEADERS, BLOCKS_PER_CHUNK as BLOCKS_PER_CHUNK } from "../constants"
import { IBlockRow } from "@/app/interfaces"
import { Button } from "@/app/ui/button"
import useScrollPosition from "../hooks/useScrollPosition"

export default function Page() {
  const [reversed, setReversed] = useState<boolean>(true); // Revers table order
  const [expandCounter, setExpandCounter] = useState<number>(0) // Auto expand table as page is scrolled
  const [latestBlockNum, setLatest] = useState<number>(); // Serves as end value for blocks fetch scope
  const [blocksData, setBlocksData] = useState<IBlockRow[]>([]); // Blocks data list
  const scroll = useScrollPosition() // Scroll position hook

  useEffect(() => { // Auto expand feature. Can be improved but works well for now.
    if (scroll > (window.innerHeight / 2) * expandCounter) {
      expand()
    }
  }, [scroll])

  // Executed on component mount and when reversed state is changes
  useEffect(() => {
    fetch(`api/latestBlock`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      if (reversed)
        setLatest(data.content ? data.content.block.header.b_num : 0) // Set latest block. If error set latest to 0 (won't load any blocks)
      else
        setLatest(BLOCKS_PER_CHUNK)
    });
  }, [reversed]);

  // Executed after latestBlock state is changed
  useEffect(() => {
    if (latestBlockNum) {
      fetch(`/api/blocks`, {
        method: 'POST',
        body: reversed ?
          JSON.stringify(getRange((latestBlockNum - BLOCKS_PER_CHUNK) >= 0 ? latestBlockNum - BLOCKS_PER_CHUNK : 0, latestBlockNum))
          :
          JSON.stringify(getRange(0, latestBlockNum)),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        const blocks = data.content.map((rawBlock: any)=> formatBlockData(rawBlock)) // Format raw block to app interface
        setBlocksData(data.content ? formatBlockTableRows(blocks, reversed) : []) // Set blocks. If error, set latest to empty array
      });
    }
  }, [latestBlockNum])

  // Expand table items by BLOCKS_PER_CHUNK (triggers when scroll is at a certain height on page)
  async function expand() {
    if (latestBlockNum)
      fetch(`/api/blocks`, {
        method: 'POST',
        body: reversed ?
          JSON.stringify(getRange((latestBlockNum - BLOCKS_PER_CHUNK * expandCounter) - BLOCKS_PER_CHUNK >= 0 ? (latestBlockNum - BLOCKS_PER_CHUNK * expandCounter) - BLOCKS_PER_CHUNK : 0, (latestBlockNum - BLOCKS_PER_CHUNK * expandCounter) - 1))
          :
          JSON.stringify(getRange(0 + BLOCKS_PER_CHUNK * expandCounter, latestBlockNum + BLOCKS_PER_CHUNK * expandCounter)),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        let existing = blocksData;
        const blocks = data.content.map((rawBlock: any)=> formatBlockData(rawBlock)) // Format raw block to app interface
        setBlocksData(blocks ? [...existing, ...formatBlockTableRows(blocks, reversed)] : []) // Set blocks. If error, set latest to empty array
      });
    setExpandCounter(expandCounter + 1)
  }

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Blocks</Typography>
        <Typography variant="small" className="text-gray-600">Blocks on the A-Block blockchain</Typography>
      </div>
      <Button className="w-fit h-fit" onClick={() => { setReversed(!reversed); setExpandCounter(0) }}>Order</Button>

      <Table table={{ headers: BLOCK_HEADERS, rows: blocksData }} />
    </>
  )
}