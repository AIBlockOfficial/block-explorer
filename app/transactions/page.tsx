"use client"
import React, { useEffect, useState } from "react"
import Table, { TableType } from '@/app/ui/table'
import { Transaction, TxRow } from "@/app/interfaces"
import { Typography } from "@material-tailwind/react"
import useScrollPosition from "../hooks/useScrollPosition"
import { ITEMS_PER_CHUNK } from "../constants"
import { formatTxTableRow } from "../utils"

export default function Page() {
  // const [reversed, setReversed] = useState<boolean>(true); // Revers table order
  const [expandCounter, setExpandCounter] = useState<number>(0) // Auto expand table as page is scrolled
  const [latestTxNum, setLatestTxNum] = useState<number>() // Serves as end value for blocks fetch scope
  const [txsData, setTxsData] = useState<TxRow[]>([]) // Txs data list
  const scroll = useScrollPosition() // Scroll position hook

  useEffect(() => { 
    if (scroll > (window.innerHeight / 2) * expandCounter) {
      expand()
    }
  }, [scroll])

  useEffect(() => {
    fetch(`api/transactions?limit=${ITEMS_PER_CHUNK}&offset=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const data = await response.json()
      if (data.content) {
        setLatestTxNum(data.content.pagination.total)
        const txRows: TxRow[] = await Promise.all(await data.content.transactions.map(async (tx: Transaction) => await formatTxTableRow(tx)))
        setTxsData(txRows)
      }
    })
  }, []);

  // Expand table items by ITEMS_PER_CHUNK (triggers when scroll is at a certain height on page)
  async function expand() {
    if (latestTxNum) {
      const offset = (ITEMS_PER_CHUNK * expandCounter) <= (latestTxNum - ITEMS_PER_CHUNK) ? (ITEMS_PER_CHUNK * expandCounter) : (latestTxNum - ITEMS_PER_CHUNK) 
      console.log('expand', offset)
      fetch(`api/transactions?limit=${ITEMS_PER_CHUNK}&offset=${ITEMS_PER_CHUNK * expandCounter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json()
        if (data.content) {
          let existing = txsData;
          const txRows: TxRow[] = data.content.transactions.map((tx: Transaction) => formatTxTableRow(tx))
          console.log('>',txRows)
          setTxsData([...existing, ...txRows])
        }
      })
      setExpandCounter(expandCounter + 1)
    }
  }

  useEffect(()=> {
    console.log(latestTxNum, txsData.length)

  }, [txsData])

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Transactions</Typography>
        <Typography variant="small" className="text-gray-600">Transactions on the A-Block blockchain</Typography>
      </div>
      <Table type={TableType.tx} rows={txsData} />
    </>
  )
}