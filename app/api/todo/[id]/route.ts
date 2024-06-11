import redis, { databaseName } from '@/lib/redis';
import { type NextRequest, NextResponse } from 'next/server';
import type { TodoData } from '@/lib/database.types';
import { fakeDelay } from '@/app/actions/todo';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const updatedData = {
      title: formData.get('title'),
      content: formData.get('content'),
      status: formData.get('status') ? true : false,
      updated_at: Date.now(),
    };
    if (!updatedData.title || !updatedData.content) {
      return NextResponse.json(
        { result: null, error: { name: 'ValidationError', message: 'Not all the required fields were provided.' } },
        { status: 400 }
      );
    }
    if (!params.id) {
      return NextResponse.json(
        { result: null, error: { name: 'ValidationError', message: 'ID is required.' } },
        { status: 400 }
      );
    }
    const key = params.id;
    await fakeDelay(2000);
    const currentValue = (await redis.hget(databaseName, key)) as TodoData;
    const newValue = JSON.stringify({ ...currentValue, ...updatedData });
    const result = await redis.hset(databaseName, { [key]: newValue });
    return NextResponse.json({ result, error: null });
  } catch (error: any) {
    throw NextResponse.json(
      {
        result: null,
        error: {
          name: error.name || 'Internal Server Error',
          message: `${error.message}. This is internal server error at route handler (PUT)`,
        },
      },
      { status: 500 }
    );
  }
}

//For markAsComplete
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const dataObj = {
      title: formData.get('title'),
      content: formData.get('content'),
      status: formData.get('status') === String(1) ? false : true,
      updated_at: Date.now(),
    };
    const updatedData = Object.fromEntries(Object.entries(dataObj).filter(([_, v]) => v !== null));
    if (!params.id) {
      return NextResponse.json(
        { result: null, error: { name: 'ValidationError', message: 'ID is required.' } },
        { status: 400 }
      );
    }
    const key = params.id;
    await fakeDelay(2000);
    const currentValue = (await redis.hget(databaseName, key)) as TodoData;
    const newValue = JSON.stringify({ ...currentValue, ...updatedData });
    const result = await redis.hset(databaseName, { [key]: newValue });
    return NextResponse.json({ result, error: null });
  } catch (error: any) {
    throw NextResponse.json(
      {
        result: null,
        error: {
          name: error.name || 'Internal Server Error',
          message: `${error.message}. This is internal server error at route handler (PATCH)`,
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { result: null, error: { name: 'ValidationError', message: 'ID is required.' } },
        { status: 400 }
      );
    }
    await fakeDelay(2000);
    const result = await redis.hdel(databaseName, params.id);
    return NextResponse.json({ result, error: null });
  } catch (error: any) {
    console.error(`${error.name}! ${error.message}`);
    throw NextResponse.json(
      {
        result: null,
        error: {
          name: error.name || 'Internal Server Error',
          message: `${error.message}. This is internal server error at route handler (DELETE)`,
        },
      },
      { status: 500 }
    );
  }
}
