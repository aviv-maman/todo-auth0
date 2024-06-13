import { type NextRequest, NextResponse } from 'next/server';
import redis, { databaseName } from '@/lib/redis';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { fakeDelay } from '@/lib/actions/todo';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const session = await getSession();
    const todoData = {
      title: formData.get('title') as string | null,
      content: formData.get('content') as string | null,
      owner_id: session?.user.sub.split('|')[1] || null,
      owner_email: session?.user.email || null,
      owner_name: session?.user.name || null,
      owner_picture: session?.user.picture || null,
    };
    if (!todoData.title || !todoData.content) {
      return NextResponse.json(
        { result: null, error: { name: 'ValidationError', message: 'Not all the required fields were provided.' } },
        { status: 400 }
      );
    }
    if (todoData.title.length < 2 || todoData.title.length > 50) {
      return NextResponse.json(
        { result: null, error: { name: 'ValidationError', message: 'Not all the required fields were provided.' } },
        { status: 400 }
      );
    }
    const newId = customAlphabet(urlAlphabet, 25)();
    const newItem = {
      id: newId,
      created_at: Date.now(),
      updated_at: Date.now(),
      status: false,
      ...todoData,
    };
    await fakeDelay(2000);
    const result = await redis.hset(databaseName, { [newId]: JSON.stringify(newItem) });
    return NextResponse.json({ result, error: null });
  } catch (error: any) {
    console.error(`${error.name}! ${error.message}`);
    throw NextResponse.json(
      {
        result: null,
        error: {
          name: error.name || 'Internal Server Error',
          message: `${error.message}. This is internal server error at route handler (POST)`,
        },
      },
      { status: 500 }
    );
  }
}
