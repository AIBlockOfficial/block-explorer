"use client"
import React, { useEffect, useState } from "react"
import Table, { TableType } from '@/app/ui/table'
import { TxRow } from "@/app/interfaces"
import { Typography } from "@material-tailwind/react"
import { useInfiniteTxRows } from "../utils/fetch.utils"
import usePageBottom from "../hooks/usePageBottom"
import { ReverseFilterContext } from "../context/tableFiltersContext"

export default function Page() {
  // TABLE FILTERS
  const [reversed, setReversed] = useState<boolean>(false)
  const reverseFilter = { reversed: reversed, setReversed };

  const desc = useInfiniteTxRows(false);
  const txsList: TxRow[] = desc.txRows
  const asc = useInfiniteTxRows(true);
  const reversedTxsList: TxRow[] = asc.txRows
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
        <Typography variant="lead" className="">Transactions</Typography>
        <Typography variant="small" className="text-gray-600">Transactions on the AIBlock blockchain</Typography>
      </div>
      <Table type={TableType.tx} rows={!reversed ? txsList : reversedTxsList} />
    </ReverseFilterContext.Provider>
  )
}