'use client'
import React, { useEffect, useState, useContext } from "react"
import Table, { TableType } from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { BlockRow } from "@/app/interfaces"
import usePageBottom from "../hooks/usePageBottom";
import { useInfiniteBlockRows } from "../utils/fetch.utils"
import { ReverseFilterContext } from "../context/tableFiltersContext"

export default function Page() {
  const { reverse, setReverse } = useContext(ReverseFilterContext);

  const { blockRows, size, setSize } = useInfiniteBlockRows();
  const blocksList: BlockRow[] = blockRows
  const reachedBottom = usePageBottom()

  useEffect(() => {
    if (reachedBottom) {
      setSize(size + 1)
    }
  }, [reachedBottom])

  return (
    <>
      <div className="mb-2">
        <Typography variant="lead" className="">Blocks</Typography>
        <Typography variant="small" className="text-gray-600">Blocks on the AIBlock blockchain</Typography>
      </div>
      <Table rows={blocksList} type={TableType.block} />
    </>
  )
}