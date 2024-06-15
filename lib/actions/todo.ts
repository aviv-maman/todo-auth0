'use server';
import { revalidatePath } from 'next/cache';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { getSession } from '@auth0/nextjs-auth0';
import redis, { databaseName } from '@/lib/redis';

const INITIAL_STATE: { result: number | string | null; error: { name: number | string; message: string } | null } = {
  result: null,
  error: null,
};

export const addTodoItem = async (prevState: typeof INITIAL_STATE, formData: FormData) => {
  prevState = { ...INITIAL_STATE };
  try {
    const session = await getSession();
    const todoData = {
      title: formData.get('title') as string | null,
      content: formData.get('content') as string | null,
    };
    if (!todoData.title || !todoData.content) {
      return {
        result: null,
        error: { name: 'Validation Error', message: 'Not all the required fields were provided.' },
      };
    }
    if (todoData.title.length < 2 || todoData.title.length > 50) {
      return {
        result: null,
        error: { name: 'Validation Error', message: 'Title must be between 2 and 50 characters.' },
      };
    }
    const newId = customAlphabet(urlAlphabet, 25)();
    const newItem = {
      id: newId,
      created_at: Date.now(),
      updated_at: Date.now(),
      owner_id: session?.user.sub.split('|')[1] || null,
      owner_email: session?.user.email || null,
      owner_name: session?.user.name || null,
      owner_picture: session?.user.picture || null,
      status: false,
      ...todoData,
    };
    await fakeDelay(2000);
    const result = await redis.hset(databaseName, { [newId]: JSON.stringify(newItem) });
    prevState = { result, error: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in addTodoItem', error);
    prevState = { result: null, error: { name: error?.name || 'Internal Server Error', message: error?.message } };
  }
  return prevState;
};

export const editTodoItem = async (id: string, prevState: typeof INITIAL_STATE, formData: FormData) => {
  prevState = { ...INITIAL_STATE };
  try {
    const session = await getSession();
    // if (!session) {
    //   return { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } };
    // }
    if (!id) {
      return { result: null, error: { name: 'Validation Error', message: 'ID is required.' } };
    }
    const updatedData = {
      title: formData.get('title'),
      content: formData.get('content'),
      status: formData.get('status') === String(1 || true) ? true : false,
      updated_at: Date.now(),
    };
    if (!updatedData.title || !updatedData.content) {
      return {
        result: null,
        error: { name: 'Validation Error', message: 'Not all the required fields were provided.' },
      };
    }
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, id);
    if (!currentValue) {
      return { result: null, error: { name: 'Not Found Error', message: 'The requested resource was not found.' } };
    }
    // Check if the user is the owner of the todo item
    // And if the owner_id is not a guest.
    // If the owner is a guest (owner_id === null), then the user can edit the todo item.
    const [isAuthor, isUserAdmin, isUserAuthor] = [
      currentValue?.owner_id ? true : false,
      process.env.AUTH0_ADMIN_EMAIL === session?.user.email,
      currentValue?.owner_id === session?.user?.sub?.split('|')[1],
    ];
    if (isAuthor && !isUserAuthor && !isUserAdmin) {
      return { result: null, error: { name: 'Authorization Error', message: 'Invalid authorization.' } };
    }
    const newValue = JSON.stringify({ ...currentValue, ...updatedData });
    const result = await redis.hset(databaseName, { [id]: newValue });
    prevState = { result, error: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in editTodoItem', error);
    prevState = { result: null, error: { name: error?.name || 'Internal Server Error', message: error?.message } };
  }
  return prevState;
};

export const deleteTodoItem = async (id: string, prevState: typeof INITIAL_STATE) => {
  prevState = { ...INITIAL_STATE };
  try {
    const session = await getSession();
    // if (!session) {
    //   return { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } };
    // }
    if (!id) {
      return { result: null, error: { name: 'Validation Error', message: 'ID is required.' } };
    }
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, id);
    if (!currentValue) {
      return { result: null, error: { name: 'Not Found Error', message: 'The requested resource was not found.' } };
    }
    // Check if the user is the owner of the todo item
    // And if the owner_id is not a guest.
    // If the owner is a guest (owner_id === null), then the user can delete the todo item.
    const [isAuthor, isUserAdmin, isUserAuthor] = [
      currentValue?.owner_id ? true : false,
      process.env.AUTH0_ADMIN_EMAIL === session?.user.email,
      currentValue?.owner_id === session?.user?.sub?.split('|')[1],
    ];
    if (isAuthor && !isUserAuthor && !isUserAdmin) {
      return { result: null, error: { name: 'Authorization Error', message: 'Invalid authorization.' } };
    }
    const result = await redis.hdel(databaseName, id);
    prevState = { result, error: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in deleteTodoItem', error);
    prevState = { result: null, error: { name: error?.name || 'Internal Server Error', message: error?.message } };
  }
  return prevState;
};

export const markAsComplete = async (id: string, prevState: typeof INITIAL_STATE, formData: FormData) => {
  prevState = { ...INITIAL_STATE };
  try {
    const session = await getSession();
    // if (!session) {
    //   return { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } };
    // }
    if (!id) {
      return { result: null, error: { name: 'Validation Error', message: 'ID is required.' } };
    }
    const updatedData = {
      status: formData.get('status') === String(1 || true) ? true : false,
      updated_at: Date.now(),
    };
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, id);
    if (!currentValue) {
      return { result: null, error: { name: 'Not Found Error', message: 'The requested resource was not found.' } };
    }
    // Check if the user is the owner of the todo item
    // And if the owner_id is not a guest.
    // If the owner is a guest (owner_id === null), then the user can edit the todo item.
    const [isAuthor, isUserAdmin, isUserAuthor] = [
      currentValue?.owner_id ? true : false,
      process.env.AUTH0_ADMIN_EMAIL === session?.user.email,
      currentValue?.owner_id === session?.user?.sub?.split('|')[1],
    ];
    if (isAuthor && !isUserAuthor && !isUserAdmin) {
      return { result: null, error: { name: 'Authorization Error', message: 'Invalid authorization.' } };
    }
    const newValue = JSON.stringify({ ...currentValue, ...updatedData });
    const result = await redis.hset(databaseName, { [id]: newValue });
    prevState = { result, error: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in markAsComplete', error);
    prevState = { result: null, error: { name: error?.name || 'Internal Server Error', message: error?.message } };
  }
  return prevState;
};

export const fakeDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
