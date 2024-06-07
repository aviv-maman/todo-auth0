import { type NextRequest, NextResponse } from 'next/server';
import redis, { databaseName } from '@/lib/redis';
import { customAlphabet, urlAlphabet } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const todoData = {
      title: formData.get('title'),
      content: formData.get('content'),
    };
    if (!todoData.title || !todoData.content) {
      throw NextResponse.json(
        { result: null, error: 'Not all the required fields were provided.' },
        { status: 400, statusText: 'Bad Request', url: request.url }
      );
    }
    const newId = customAlphabet(urlAlphabet, 25)();
    const newItem = {
      id: newId,
      created_at: Date.now(),
      updated_at: Date.now(),
      title: todoData.title,
      content: todoData.content,
      status: false,
    };
    const result = await redis.hset(databaseName, { [newId]: JSON.stringify(newItem) });
    return NextResponse.json({ result, error: null });
  } catch (error) {
    if (error instanceof Error) console.error(`${error.name}: ${error.message}`);
    throw NextResponse.json(
      { result: null, error: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', url: request.url }
    );
  }
}
