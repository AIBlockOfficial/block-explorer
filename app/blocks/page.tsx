'use client'
import React from "react"
import Table from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { ITable } from "../constants"
import BlockData from '@/app/data/blocks.json'


export default function Page() {
  const BlockTable: ITable = {
    headers: ["Number", "Block Hash", "Status", "Nb of Tx", "Age"],
    rows: BlockData
  }
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