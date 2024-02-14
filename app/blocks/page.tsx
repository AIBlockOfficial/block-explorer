'use client'
import React, { useEffect, useState } from "react"
import Table from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { getRange, formatBlockTableRow } from "../utils"
import { BLOCK_TABLE_HEADERS, BLOCKS_PER_CHUNK as BLOCKS_PER_CHUNK } from "../constants"
import { BlockRow } from "@/app/interfaces"
import { Button } from "@/app/ui/button"
import useScrollPosition from "../hooks/useScrollPosition"

export default function Page() {
  const [reversed, setReversed] = useState<boolean>(true); // Revers table order
  const [expandCounter, setExpandCounter] = useState<number>(0) // Auto expand table as page is scrolled
  const [latestBlockNum, setLatest] = useState<number>(); // Serves as end value for blocks fetch scope
  const [blocksData, setBlocksData] = useState<BlockRow[]>([]); // Blocks data list
  const scroll = useScrollPosition() // Scroll position hook

  useEffect(() => { // Auto expand feature. Can be improved but works well for now.
    if (scroll > (window.innerHeight / 2) * expandCounter) {
      expand()
    }
  }, [scroll])

  // Executed on component mount and when reversed state is changes
  // useEffect(() => {
  //   fetch(`api/latestBlock`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }).then(async response => {
  //     const data = await response.json()
  //     if (reversed)
  //       setLatest(data.content ? data.content.block.header.b_num : 0) // Set latest block. If error set latest to 0 (won't load any blocks)
  //     else {
  //       console.log('HERE: ', data.content.block.header.b_num > BLOCKS_PER_CHUNK)
  //       setLatest(data.content.block.header.b_num < BLOCKS_PER_CHUNK ? data.content.block.header.b_num : BLOCKS_PER_CHUNK)
  //     }
  //   });
  // }, [reversed]);

  useEffect(() => {
    fetch(`api/latestBlock`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      setLatest(data.content ? data.content.block.header.b_num : 0) // Set latest block. If error set latest to 0 (won't load any blocks)

    });
  }, []);

  // Executed after latestBlock state is changed
  useEffect(() => {
    if (latestBlockNum) {
      fetch(`/api/blocks`, {
        method: 'POST',
        body: JSON.stringify(getRange((latestBlockNum - BLOCKS_PER_CHUNK) >= 0 ? latestBlockNum - BLOCKS_PER_CHUNK : 0, latestBlockNum)),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        const blocksRows: BlockRow[] = data.content.map((rawBlock: any) => formatBlockTableRow(rawBlock)) // Format raw block to app interface

        console.log('HERE: ', blocksRows)

        setBlocksData(blocksRows.reverse())
      });
    }
  }, [latestBlockNum])

  // Expand table items by BLOCKS_PER_CHUNK (triggers when scroll is at a certain height on page)
  async function expand() {
    if (latestBlockNum) {
      fetch(`/api/blocks`, {
        method: 'POST',
        body: JSON.stringify(getRange((latestBlockNum - BLOCKS_PER_CHUNK * expandCounter) - BLOCKS_PER_CHUNK >= 0 ? (latestBlockNum - BLOCKS_PER_CHUNK * expandCounter) - BLOCKS_PER_CHUNK : 0, (latestBlockNum - BLOCKS_PER_CHUNK * expandCounter) - 1)),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        let existing = blocksData;
        const blocksRows: BlockRow[] = data.content.map((rawBlock: any) => formatBlockTableRow(rawBlock)) // Format raw block to app interface
        setBlocksData([...existing, ...blocksRows.reverse()])
      });
      setExpandCounter(expandCounter + 1)
    }
  }

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Blocks</Typography>
        <Typography variant="small" className="text-gray-600">Blocks on the A-Block blockchain</Typography>
      </div>
      {blocksData.length > 0 && <Button className="w-fit h-fit" onClick={() => { setReversed(!reversed); setExpandCounter(0) }}>Order</Button>}

      <Table table={{ headers: BLOCK_TABLE_HEADERS, rows: blocksData }} />
    </>
  )
}