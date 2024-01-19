"use client"
import React from "react"
import Table from '@/app/ui/table'
import { ITable } from "@/app/interfaces"
import { Typography } from "@material-tailwind/react"

/** TODO */

export default function Page() {
  const txTable: ITable = {
    headers: ["Transaction Hash", "Block Num.", "Type", "Status", "Address", "Age"],
    rows: []
  }

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Transactions</Typography>
        <Typography variant="small" className="text-gray-600">Transactions on the A-Block blockchain</Typography>
      </div>
      <Table table={txTable} />
    </>
  )
}