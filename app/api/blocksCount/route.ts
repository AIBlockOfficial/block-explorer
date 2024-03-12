import { NextRequest, NextResponse } from "next/server"
const chain = require('../chainFetch')

export async function GET(_req: NextRequest) {
  try {
    const blocksCount = await chain.blocksCount()
    return NextResponse.json({content: blocksCount.total})
  } catch (error: any) {
    return NextResponse.json(
      {
        ...error
      }
    )
  }
}