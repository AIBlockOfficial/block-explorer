import { NextResponse } from "next/server";

const chain = require('../chainFetch');

export async function GET() {
  try {
    const latestBlock = await chain.fetchLatest();
    return NextResponse.json({ ...latestBlock });
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