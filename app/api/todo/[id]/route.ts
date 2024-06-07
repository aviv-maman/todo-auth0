import redis, { databaseName } from '@/lib/redis';
import { type NextRequest, NextResponse } from 'next/server';
import type { TodoData } from '@/lib/database.types';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const updatedData = {
      title: formData.get('title'),
      content: formData.get('content'),
      status: formData.get('status') ? true : false,
      updated_at: Date.now(),
    };
    if (!updatedData.title || !updatedData.content) {
      throw NextResponse.json(
        { result: null, error: 'Not all the required fields were provided.' },
        { status: 400, statusText: 'Bad Request', url: request.url }
      );
    }
    if (!params.id) {
      throw NextResponse.json(
        { result: null, error: 'ID is required.' },
        { status: 400, statusText: 'Bad Request', url: request.url }
      );
    }
    const key = params.id;
    const currentValue = (await redis.hget(databaseName, key)) as TodoData;
    const newValue = JSON.stringify({ ...currentValue, ...updatedData });
    const result = await redis.hset(databaseName, { [key]: newValue });
    return NextResponse.json({ result, error: null });
  } catch (error) {
    if (error instanceof Error) console.error(`${error.name}: ${error.message}`);
    throw NextResponse.json(
      { result: null, error: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', url: request.url }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      throw NextResponse.json(
        { result: null, error: 'ID is required.' },
        { status: 400, statusText: 'Bad Request', url: request.url }
      );
    }
    const result = await redis.hdel(databaseName, params.id);
    return NextResponse.json({ result, error: null });
  } catch (error) {
    if (error instanceof Error) console.error(`${error.name}: ${error.message}`);
    throw NextResponse.json(
      { result: null, error: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', url: request.url }
    );
  }
}
