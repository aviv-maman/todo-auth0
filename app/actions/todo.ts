'use server';
import { revalidatePath } from 'next/cache';

const DOMAIN_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
const INITIAL_STATE = { result: null, error: null };

export const addTodoItem = async (prevState: typeof INITIAL_STATE, formData: FormData) => {
  try {
    const res = await fetch(`${DOMAIN_URL}/api/todo`, { method: 'POST', body: formData });
    const data = await res.json();
    prevState = { ...prevState, result: data?.result, error: data?.error };
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('error in addTodoItem', error);
  }
  return prevState;
};

export const editTodoItem = async (prevState: typeof INITIAL_STATE & { id: string }, formData: FormData) => {
  try {
    const res = await fetch(`${DOMAIN_URL}/api/todo/${prevState.id}`, { method: 'PATCH', body: formData });
    const data = await res.json();
    prevState = { ...prevState, result: data?.result, error: data?.error };
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('error in editTodoItem', error);
  }
  return prevState;
};

//To use with <form action={formAction} encType='multipart/form-data'>
export const deleteTodoItem = async (prevState: typeof INITIAL_STATE & { id: string }) => {
  try {
    const res = await fetch(`${DOMAIN_URL}/api/todo/${prevState.id}`, { method: 'DELETE' });
    const data = await res.json();
    prevState = { ...prevState, result: data?.result, error: data?.error };
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('error in deleteTodoItem', error);
  }
  return prevState;
};

export const fakeDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
