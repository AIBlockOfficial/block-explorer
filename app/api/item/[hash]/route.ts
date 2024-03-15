import { NextRequest, NextResponse } from "next/server"
const chain = require('../../chainFetch')
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: { hash: string } }) {
    try {
      const item = await chain.fetchItem(params.hash);  
      return NextResponse.json(item);
    } catch (error: any) {
      return NextResponse.json(
        {
          ...error
        },
        {
          status: error.status,
        }
      );
    }
  }