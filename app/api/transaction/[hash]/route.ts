import { NextRequest, NextResponse } from "next/server";
const chain = require('../../chainFetch');

export async function GET(_req: NextRequest, { params }: { params: { hash: string } }) {
    try {
      console.log('?')
      const transaction = await chain.transaction(params.hash); 
      console.log('TX : ', transaction) 
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