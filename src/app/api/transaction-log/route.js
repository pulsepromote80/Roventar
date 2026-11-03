import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'default';

    let apiUrl;

    if (source === 'crypto-terminal') {
      apiUrl = 'https://tradeppips.com/api/Authentication/getAllTransactionLog';
    } else {
      apiUrl = 'https://tradeppips.com/api/Authentication/getAllTransactionLog_xoxo';
    }

    const headers = { 'Content-Type': 'application/json' };

    const response = await fetch(apiUrl, {
      headers,
      cache: 'no-cache',
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Transaction log proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction logs' },
      { status: 500 }
    );
  }
}
