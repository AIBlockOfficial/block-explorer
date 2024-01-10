import { NextRequest, NextResponse } from "next/server";
const chain = require('../../chainFetch');

export async function GET(_req: NextRequest, { params }: { params: { hash: string } }) {
    try {
      const item = await chain.fetchItem(params.hash);  
      return NextResponse.json(item);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to get item" },
        {
          status: 500,
        }
      );
    }
  }