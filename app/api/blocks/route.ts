import { NextRequest, NextResponse } from "next/server";
const chain = require('../chainFetch');

export async function POST(req: NextRequest) {
  const reqBody = JSON.parse(await req.text());

    try {
      const item = await chain.fetchBlocks(reqBody.map((i: string) => parseInt(i)));
      return NextResponse.json(item);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to get block with block number" },
        {
          status: 500,
        }
      );
    }
  }