import { NextRequest, NextResponse } from "next/server";
const chain = require('../../chainFetch');

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await chain.blockTxs(params.id);
    return NextResponse.json({content: item});
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