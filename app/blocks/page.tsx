'use client'
import React, { useEffect, useState } from "react"
import Table, { TableType } from '@/app/ui/table'
import { Typography } from "@material-tailwind/react"
import { BlockRow } from "@/app/interfaces"
import usePageBottom from "../hooks/usePageBottom";
import { useInfBlockRows } from "../utils/fetch.utils"
import { ReverseFilterContext } from "../context/tableFiltersContext"

export default function Page() {
  // TABLE FILTERS
  const [reversed, setReversed] = useState<boolean>(false)
  const reverseFilter = { reversed: reversed, setReversed };

  const desc = useInfBlockRows(false)
  const blocksList: BlockRow[] = desc.blockRows
  const asc = useInfBlockRows(true)
  const reversedBlocksList: BlockRow[] = asc.blockRows
  const reachedBottom = usePageBottom()

  useEffect(() => {
    if (reachedBottom) {
      if (!reversed) {
        desc.setSize(desc.size + 1)
      } else {
        asc.setSize(asc.size + 1)
      }
    }
  }, [reachedBottom])

  return (
    <ReverseFilterContext.Provider value={reverseFilter}>
      <div className="mb-2">
        <Typography variant="lead" className="">Blocks</Typography>
        <Typography variant="small" className="text-gray-600">Blocks on the AIBlock blockchain</Typography>
      </div>
      <Table rows={!reversed ? blocksList : reversedBlocksList} type={TableType.block} />
    </ReverseFilterContext.Provider>
  )
}