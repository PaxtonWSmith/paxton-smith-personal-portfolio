import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = 'https://official-joke-api.appspot.com/random_joke';

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch joke' }, { status: 500 });
  }
}