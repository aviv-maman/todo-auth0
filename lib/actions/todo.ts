'use server';
import { revalidatePath } from 'next/cache';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { getSession } from '@auth0/nextjs-auth0';
import redis, { databaseName } from '@/lib/redis';
import { todoFormSchema, markAsCompleteFormSchema } from '../schemas/todoFormSchema';
import type { TodoFormState, MarkAsCompleteFormState, DeleteTodoFormState } from '../schemas/todoFormSchema';
// import type { ZodIssue } from 'zod';

export const addTodoItem = async (prevState: TodoFormState, formData: FormData) => {
  try {
    const session = await getSession();
    const data = Object.fromEntries(formData);
    const parsed = await todoFormSchema.safeParseAsync(data);
    if (!parsed.success) {
      const flattenIssues = parsed.error.flatten();
      // const flattenIssues = parsed.error.flatten((issue: ZodIssue) => ({
      //   name: `Validation Error in ${issue.path}`,
      //   message: issue.message,
      //   errorCode: issue.code,
      // }));
      // const issues = parsed.error.issues.map((issue) => ({
      //   name: `Validation Error in ${issue.path}`,
      //   message: issue.message,
      //   errorCode: issue.code,
      // }));
      prevState = { result: null, errors: flattenIssues };
      return prevState;
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
      ...parsed.data,
    };
    await fakeDelay(2000);
    const result = await redis.hset(databaseName, { [newId]: JSON.stringify(newItem) });
    prevState = { result, errors: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in addTodoItem', error);
    prevState = {
      result: null,
      errors: { serverError: { name: error?.name || 'Internal Server Error', message: error?.message, errorCode: 500 } },
    };
  }
  return prevState;
};

export const editTodoItem = async (id: string, prevState: TodoFormState, formData: FormData) => {
  try {
    const session = await getSession();
    // if (!session) {
    //   return { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } };
    // }
    if (!id) return { result: null, errors: { serverError: { name: 'Validation Error', message: 'ID is required.', errorCode: 400 } } };
    const data = Object.fromEntries(formData);
    const parsed = await todoFormSchema.safeParseAsync(data);
    if (!parsed.success) {
      const flattenIssues = parsed.error.flatten();
      prevState = { result: null, errors: flattenIssues };
      return prevState;
    }
    const updatedData = {
      ...parsed.data,
      status: formData.get('status') === String(1 || true) ? true : false,
      updated_at: Date.now(),
    };
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, id);
    if (!currentValue) {
      return {
        result: null,
        errors: { serverError: { name: 'Not Found Error', message: 'The requested resource was not found.', errorCode: 404 } },
      };
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
      return { result: null, errors: { serverError: { name: 'Authorization Error', message: 'Invalid authorization.', errorCode: 401 } } };
    }
    const newValue = JSON.stringify({ ...currentValue, ...updatedData });
    const result = await redis.hset(databaseName, { [id]: newValue });
    prevState = { result, errors: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in editTodoItem', error);
    prevState = {
      result: null,
      errors: { serverError: { name: error?.name || 'Internal Server Error', message: error?.message, errorCode: 500 } },
    };
  }
  return prevState;
};

export const deleteTodoItem = async (id: string, prevState: DeleteTodoFormState) => {
  try {
    const session = await getSession();
    // if (!session) {
    //   return { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } };
    // }
    if (!id) return { result: null, errors: { serverError: { name: 'Validation Error', message: 'ID is required.', errorCode: 400 } } };
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, id);
    if (!currentValue) {
      return {
        result: null,
        errors: { serverError: { name: 'Not Found Error', message: 'The requested resource was not found.', errorCode: 404 } },
      };
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
      return { result: null, errors: { serverError: { name: 'Authorization Error', message: 'Invalid authorization.', errorCode: 401 } } };
    }
    const result = await redis.hdel(databaseName, id);
    prevState = { result, errors: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in deleteTodoItem', error);
    prevState = {
      result: null,
      errors: { serverError: { name: error?.name || 'Internal Server Error', message: error?.message, errorCode: 500 } },
    };
  }
  return prevState;
};

export const markAsComplete = async (id: string, prevState: MarkAsCompleteFormState, formData: FormData) => {
  try {
    const session = await getSession();
    // if (!session) {
    //   return { result: null, error: { name: 'Authorization Error', message: 'User is not authenticated.' } };
    // }
    if (!id) return { result: null, errors: { serverError: { name: 'Validation Error', message: 'ID is required.', errorCode: 400 } } };
    const data = Object.fromEntries(formData);
    const convertedData = { status: data['status'] === String(1 || true) ? true : false };
    const parsed = await markAsCompleteFormSchema.safeParseAsync(convertedData);
    if (!parsed.success) {
      const flattenIssues = parsed.error.flatten();
      prevState = { result: null, errors: flattenIssues };
      return prevState;
    }
    const updatedData = {
      status: convertedData['status'],
      updated_at: Date.now(),
    };
    await fakeDelay(2000);
    const currentValue: any = await redis.hget(databaseName, id);
    if (!currentValue) {
      return {
        result: null,
        errors: { serverError: { name: 'Not Found Error', message: 'The requested resource was not found.', errorCode: 404 } },
      };
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
      return { result: null, errors: { serverError: { name: 'Authorization Error', message: 'Invalid authorization.', errorCode: 401 } } };
    }
    const newValue = JSON.stringify({ ...currentValue, ...updatedData });
    const result = await redis.hset(databaseName, { [id]: newValue });
    prevState = { result, errors: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in markAsComplete', error);
    prevState = {
      result: null,
      errors: { serverError: { name: error?.name || 'Internal Server Error', message: error?.message, errorCode: 500 } },
    };
  }
  return prevState;
};

export const fakeDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
