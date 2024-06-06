import { type NextRequest, NextResponse } from 'next/server';
import redis, { databaseName } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const todoData = {
      title: formData.get('title'),
      content: formData.get('content'),
    };
    if (!todoData.title || !todoData.content) {
      return NextResponse.json({ result: null, error: 'Not all the required fields were provided.' }, { status: 400 });
    }
    const newId = Date.now().toString();
    const newItem = JSON.stringify({ title: todoData.title, content: todoData.content, status: false });
    const result = await redis.hset(databaseName, { [newId]: newItem });
    return NextResponse.json({ result, error: null });
  } catch (error) {
    if (error instanceof Error) console.error(`${error.name}: ${error.message}`);
    return NextResponse.json({ result: null, error: 'Internal Server Error' }, { status: 500 });
  }
}
