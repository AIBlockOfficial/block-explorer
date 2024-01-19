import { NextRequest, NextResponse } from "next/server";

const chain = require('../chainFetch');

export async function POST(req: NextRequest) {
  const reqBody = JSON.parse(await req.text());
  try {
    const blocks = await chain.fetchBlocks(reqBody.map((i: string) => parseInt(i)));
    return NextResponse.json({ ...blocks });
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