import { NextRequest, NextResponse } from "next/server"
const chain = require('../chainFetch')
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest) {
  try {
    const url = new URL(_req.url)
    const limit = url.searchParams.get("limit")
    const offset = url.searchParams.get("offset")
    const blocks = await chain.blocks(limit, offset)
    return NextResponse.json({ content: blocks })
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