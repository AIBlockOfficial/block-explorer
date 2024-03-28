import { NextRequest, NextResponse } from "next/server"
const chain = require('../chainFetch')
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest) {
  try {
    const circulatingSupply = await chain.circulatingSupply()
    return NextResponse.json({ content: circulatingSupply })
  } catch (error: any) {
    return NextResponse.json(
      {
        ...error
      },
      {
        status: error.status,
      }
    )
  }
}