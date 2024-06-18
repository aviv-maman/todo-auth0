import { z } from 'zod';

export const todoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .max(50, {
      message: 'Title must be at most 50 characters.',
    }),
  content: z
    .string()
    .trim()
    .min(2, {
      message: 'Content must be at least 2 characters.',
    })
    .max(250, {
      message: 'Content must be at most 250 characters.',
    }),
});

export type TodoFormSchema = z.infer<typeof todoFormSchema>;

export const todoFormInitialState: TodoFormState = { result: null, errors: null };

export type TodoFormState = {
  result: number | string | null;
  // errors: { name: string; message: string; errorCode: string | number }[] | null;
  errors: {
    formErrors?: FlattenedErrors['formErrors'];
    fieldErrors?: FlattenedErrors['fieldErrors'];
    serverError?: { name: string; message: string; errorCode: string | number };
  } | null;
};

type FlattenedErrors = z.inferFlattenedErrors<typeof todoFormSchema>;

//markAsComplete
export const markAsCompleteFormSchema = z.object({
  status: z.boolean().optional(),
});

export type MarkAsCompleteFormSchema = z.infer<typeof markAsCompleteFormSchema>;

export const markAsCompleteFormInitialState: MarkAsCompleteFormFormState = { result: null, errors: null };

export type MarkAsCompleteFormFormState = {
  result: number | string | null;
  errors: {
    formErrors?: MarkAsCompleteFlattenedErrors['formErrors'];
    fieldErrors?: MarkAsCompleteFlattenedErrors['fieldErrors'];
    serverError?: { name: string; message: string; errorCode: string | number };
  } | null;
};

type MarkAsCompleteFlattenedErrors = z.inferFlattenedErrors<typeof markAsCompleteFormSchema>;
