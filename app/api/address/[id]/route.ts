import { NextRequest, NextResponse } from "next/server"
const chain = require('../../chainFetch')
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await chain.address(params.id)
    return NextResponse.json({content: item})
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