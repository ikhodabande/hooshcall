import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const db_info = await request.json();

    // Here you can add your logic to save the database configuration
    // For example, store it in your database or configuration file

    // For now, we'll just return a success response
    return NextResponse.json(
      { message: 'Database configuration saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing database configuration:', error);
    return NextResponse.json({ error: 'Failed to save database configuration' }, { status: 500 });
  }
}
