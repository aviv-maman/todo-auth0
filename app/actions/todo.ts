'use server';
import { revalidatePath } from 'next/cache';

const DOMAIN_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
const INITIAL_STATE: { result: number | string | null; error: { name: number | string; message: string } | null } = {
  result: null,
  error: null,
};

export const addTodoItem = async (prevState: typeof INITIAL_STATE, formData: FormData) => {
  // const todoData = { title: formData.get('title') as string, content: formData.get('content') as string };
  // if (!todoData.title || !todoData.content) {
  //   return (prevState = { result: null, error: 'Not all the required fields were provided.' });
  // }
  // if (todoData.title.length < 2 || todoData.title.length > 50) {
  //   return (prevState = { result: null, error: 'Title must be between 2 and 50 characters.' });
  // }
  try {
    const res = await fetch(`${DOMAIN_URL}/api/todo`, { method: 'POST', body: formData });
    if (!res.ok) {
      const error: (typeof INITIAL_STATE)['error'] = { name: res.status, message: res.statusText };
      if (res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        error.name = data.error.name;
        error.message = data.error.message;
      }
      return { result: null, error };
    }
    const data = await res.json();
    prevState = { result: data?.result, error: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in addTodoItem', error);
    prevState = { result: null, error: { name: error?.name, message: error?.message } };
  }
  return prevState;
};

export const editTodoItem = async (prevState: typeof INITIAL_STATE & { id: string }, formData: FormData) => {
  try {
    const res = await fetch(`${DOMAIN_URL}/api/todo/${prevState.id}`, { method: 'PATCH', body: formData });
    if (!res.ok) {
      const error: (typeof INITIAL_STATE)['error'] = { name: res.status, message: res.statusText };
      if (res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        error.name = data.error.name;
        error.message = data.error.message;
      }
      return { ...prevState, result: null, error };
    }
    const data = await res.json();
    prevState = { ...prevState, result: data?.result, error: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in editTodoItem', error);
    prevState = { ...prevState, result: null, error: { name: error?.name, message: error?.message } };
  }
  return prevState;
};

//To use with <form action={formAction} encType='multipart/form-data'>
export const deleteTodoItem = async (prevState: typeof INITIAL_STATE & { id: string }) => {
  try {
    const res = await fetch(`${DOMAIN_URL}/api/todo/${prevState.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error: (typeof INITIAL_STATE)['error'] = { name: res.status, message: res.statusText };
      if (res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        error.name = data.error.name;
        error.message = data.error.message;
      }
      return { ...prevState, result: null, error };
    }
    const data = await res.json();
    prevState = { ...prevState, result: data?.result, error: null };
    revalidatePath('/', 'layout');
  } catch (error: any) {
    console.error('error in deleteTodoItem', error);
    prevState = { ...prevState, result: null, error: { name: error?.name, message: error?.message } };
  }
  return prevState;
};

export const fakeDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
