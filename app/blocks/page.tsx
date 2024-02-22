'use client'
import React, { useEffect, useState } from "react"
import Table, { TableType } from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { getRange, formatBlockTableRow } from "../utils"
import { BlockRow } from "@/app/interfaces"
import useScrollPosition from "../hooks/useScrollPosition"
import { ITEMS_PER_CHUNK } from "../constants"

export default function Page() {
  // const [reversed, setReversed] = useState<boolean>(true); // Revers table order
  const [expandCounter, setExpandCounter] = useState<number>(0) // Auto expand table as page is scrolled
  const [latestBlockNum, setLatest] = useState<number>(); // Serves as end value for blocks fetch scope
  const [blocksData, setBlocksData] = useState<BlockRow[]>([]); // Blocks data list
  const scroll = useScrollPosition() // Scroll position hook

  useEffect(() => { // Auto expand feature. Can be improved but works well for now.
    if (scroll > (window.innerHeight / 2) * expandCounter) {
      expand()
    }
  }, [scroll])

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
        body: JSON.stringify(getRange((latestBlockNum - ITEMS_PER_CHUNK) >= 0 ? latestBlockNum - ITEMS_PER_CHUNK : 0, latestBlockNum)),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        const blocksRows: BlockRow[] = data.content.map((rawBlock: any) => formatBlockTableRow(rawBlock)) // Format raw block to app interface
        setBlocksData(blocksRows.reverse())
      });
    }
  }, [latestBlockNum])

  // Expand table items by ITEMS_PER_CHUNK (triggers when scroll is at a certain height on page)
  async function expand() {
    if (latestBlockNum) {
      fetch(`/api/blocks`, {
        method: 'POST',
        body: JSON.stringify(getRange((latestBlockNum - ITEMS_PER_CHUNK * expandCounter) - ITEMS_PER_CHUNK >= 0 ? (latestBlockNum - ITEMS_PER_CHUNK * expandCounter) - ITEMS_PER_CHUNK : 0, (latestBlockNum - ITEMS_PER_CHUNK * expandCounter) - 1)),
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
      {/* {blocksData.length > 0 && <Button className="w-fit h-fit" onClick={() => { setReversed(!reversed); setExpandCounter(0) }}>Order</Button>} */}
      <Table rows={blocksData} type={TableType.block} />
    </>
  )
}