import { NextRequest, NextResponse } from "next/server";
const chain = require('../../chainFetch');

export async function GET(_req: NextRequest, { params }: { params: { hash: string } }) {
    try {
      const transaction = await chain.transaction(params.hash); 
      return NextResponse.json({content: transaction});
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