'use client'
import React, { useEffect, useState } from "react"
import Table from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { getRange, formatBlockTableRows } from "../utils/format"
import { BLOCK_HEADERS, BLOCKS_PER_PAGE } from "../constants"
import { IBlockRow } from "@/app/interfaces"
import { Button } from "@/app/ui/button"
import useScrollPosition from "../utils/useScrollPosition"

export default function Page() {
  const [reversed, setReversed] = useState<boolean>(true); // Revers table order
  const [expandCounter, setExpandCounter] = useState<number>(0) // Auto expand table as page is scrolled
  const [latestBlockNum, setLatest] = useState<number>(); // Serves as end value for blocks fetch scope
  const [blocksData, setBlocksData] = useState<IBlockRow[]>([]); // Blocks data list
  const scroll = useScrollPosition() // Scroll position hook

  useEffect(() => {
    if (scroll > (window.innerHeight / 2) * expandCounter) {
      Expand()
    }
  }, [scroll])

  // Executed on component mount
  useEffect(() => {
    fetch(`api/latestBlock`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      console.log(data)
      if (reversed)
        setLatest(data.content ? data.content.block.header.b_num : 0) // Set latest block. If error set latest to 0 (won't load any blocks)
      else
        setLatest(BLOCKS_PER_PAGE)
    });
  }, [reversed]);

  // Executed after setting latestBlock
  useEffect(() => {
    if (latestBlockNum) {
      fetch(`/api/blocks`, {
        method: 'POST',
        body: reversed ?
          JSON.stringify(getRange((latestBlockNum - BLOCKS_PER_PAGE) >= 0 ? latestBlockNum - BLOCKS_PER_PAGE : 0, latestBlockNum))
          :
          JSON.stringify(getRange(0, latestBlockNum)),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        setBlocksData(data.content ? formatBlockTableRows(data.content, reversed) : []) // Set blocks. If error, set latest to empty array
      });
    }
  }, [latestBlockNum])

  async function Expand() {
    if (latestBlockNum)
      fetch(`/api/blocks`, {
        method: 'POST',
        body: reversed ?
          JSON.stringify(getRange((latestBlockNum - BLOCKS_PER_PAGE * expandCounter) - BLOCKS_PER_PAGE >= 0 ? (latestBlockNum - BLOCKS_PER_PAGE * expandCounter) - BLOCKS_PER_PAGE : 0, (latestBlockNum - BLOCKS_PER_PAGE * expandCounter) - 1))
          :
          JSON.stringify(getRange(0 + BLOCKS_PER_PAGE * expandCounter, latestBlockNum + BLOCKS_PER_PAGE * expandCounter)),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        let existing = blocksData;
        setBlocksData(data.content ? [...existing, ...formatBlockTableRows(data.content, reversed)] : []) // Set blocks. If error, set latest to empty array
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