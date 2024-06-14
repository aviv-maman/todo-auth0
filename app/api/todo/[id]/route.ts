import redis, { databaseName } from '@/lib/redis';
import { type NextRequest, NextResponse } from 'next/server';
import type { TodoData } from '@/lib/database.types';
import { fakeDelay } from '@/lib/actions/todo';
import { getSession } from '@auth0/nextjs-auth0';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    // if (!session) {
    //   return NextResponse.json(
    //     { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } },
    //     { status: 401, statusText: 'Unauthorized' }
    //   );
    // }
    const formData = await request.formData();
    const updatedData = {
      title: formData.get('title'),
      content: formData.get('content'),
      status: formData.get('status') ? true : false,
      updated_at: Date.now(),
    };
    if (!updatedData.title || !updatedData.content) {
      return NextResponse.json(
        { result: null, error: { name: 'Validation Error', message: 'Not all the required fields were provided.' } },
        { status: 400, statusText: 'Bad Request' }
      );
    }
    if (!params.id) {
      return NextResponse.json(
        { result: null, error: { name: 'Validation Error', message: 'ID is required.' } },
        { status: 400, statusText: 'Bad Request' }
      );
    }
    const key = params.id;
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, key);
    if (!currentValue) {
      return NextResponse.json(
        { result: null, error: { name: 'Not Found Error', message: 'The requested resource was not found.' } },
        { status: 404, statusText: 'Not Found' }
      );
    }
    // Check if the user is the owner of the todo item
    // And if the owner_id is not a guest.
    // If the owner is a guest (owner_id === null), then the user can edit the todo item.
    if (currentValue?.owner_id && session?.user?.sub?.split('|')[1] !== currentValue?.owner_id) {
      return NextResponse.json(
        { result: null, error: { name: 'Authorization Error', message: 'Invalid authorization.' } },
        { status: 401, statusText: 'Unauthorized' }
      );
    }
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
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
}

//For markAsComplete
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    // if (!session) {
    //   return NextResponse.json(
    //     { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } },
    //     { status: 401, statusText: 'Unauthorized' }
    //   );
    // }
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
        { result: null, error: { name: 'Validation Error', message: 'ID is required.' } },
        { status: 400, statusText: 'Bad Request' }
      );
    }
    const key = params.id;
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, key);
    if (!currentValue) {
      return NextResponse.json(
        { result: null, error: { name: 'Not Found Error', message: 'The requested resource was not found.' } },
        { status: 404, statusText: 'Not Found' }
      );
    }
    // Check if the user is the owner of the todo item
    // And if the owner_id is not a guest.
    // If the owner is a guest (owner_id === null), then the user can edit the todo item.
    if (currentValue?.owner_id && session?.user?.sub?.split('|')[1] !== currentValue?.owner_id) {
      return NextResponse.json(
        { result: null, error: { name: 'Authorization Error', message: 'Invalid authorization.' } },
        { status: 401, statusText: 'Unauthorized' }
      );
    }
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
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    // if (!session) {
    //   return NextResponse.json(
    //     { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } },
    //     { status: 401, statusText: 'Unauthorized' }
    //   );
    // }
    if (!params.id) {
      return NextResponse.json(
        { result: null, error: { name: 'Validation Error', message: 'ID is required.' } },
        { status: 400, statusText: 'Bad Request' }
      );
    }
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, params.id);
    if (!currentValue) {
      return NextResponse.json(
        { result: null, error: { name: 'Not Found Error', message: 'The requested resource was not found.' } },
        { status: 404, statusText: 'Not Found' }
      );
    }
    // Check if the user is the owner of the todo item
    // And if the owner_id is not a guest.
    // If the owner is a guest (owner_id === null), then the user can delete the todo item.
    if (currentValue?.owner_id && session?.user?.sub?.split('|')[1] !== currentValue?.owner_id) {
      return NextResponse.json(
        { result: null, error: { name: 'Authorization Error', message: 'Invalid authorization.' } },
        { status: 401, statusText: 'Unauthorized' }
      );
    }
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
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
}
