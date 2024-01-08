'use client'
import React, { useEffect } from "react"
import Table from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { ITable } from "../constants"
import BlockData from '@/app/data/blocks.json'


export default function Page({ params }: { params: { start: number, end: number } }) {
  const BlockTable: ITable = {
    headers: ["Number", "Block Hash", "Status", "Nb of Tx", "Age"],
    rows: BlockData
  }

  /**
   * Gets all numbers from the start value to the end value, inclusive
   * 
   * @param start {number} - The start value
   * @param end {number} - The end value
   */
  const getRange = (start: number, end: number) => {
    return [...Array(end - start + 1)].map((_, i) => start + i);
  }

  /// The block information is being pulled here
  useEffect(() => {
    fetch(`/api/blocks`, {
      method: 'POST',
      body: JSON.stringify(getRange(params.start, params.end)),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      console.log(response);
    });
  });

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Blocks</Typography>
        <Typography variant="small" className="text-gray-600">Blocks on the A-Block blockchain</Typography>
      </div>
      <Table table={BlockTable} />
    </>
  )
}