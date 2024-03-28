"use client"
import React, { useEffect, useState } from "react"
import Table, { TableType } from '@/app/ui/table'
import { TxRow } from "@/app/interfaces"
import { Typography } from "@material-tailwind/react"
import { useInfiniteTxRows } from "../utils/fetch.utils"
import usePageBottom from "../hooks/usePageBottom"

export default function Page() {
  const { txRows, size, setSize } = useInfiniteTxRows();
  const txsList: TxRow[] = txRows
  const reachedBottom = usePageBottom()

  useEffect(() => {
    if (reachedBottom) {
      setSize(size + 1)
    }
  }, [reachedBottom])

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Transactions</Typography>
        <Typography variant="small" className="text-gray-600">Transactions on the AIBlock blockchain</Typography>
      </div>
      <Table type={TableType.tx} rows={txsList} />
    </>
  )
}