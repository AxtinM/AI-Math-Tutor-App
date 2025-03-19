import { NextResponse } from 'next/server';

// This is a lightweight endpoint used by the offline page 
// to check network connectivity
export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
