'use client';
import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type TodoFormSchema, todoFormSchema, todoFormInitialState } from '@/lib/schemas/todoFormSchema';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from './ui/use-toast';
import { addTodoItem } from '@/lib/actions/todo';
import { useUser } from '@auth0/nextjs-auth0/client';

export const AddTodoForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<TodoFormSchema>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(addTodoItem, todoFormInitialState);

  const { error } = useUser();

  useEffect(() => {
    if (formState.errors?.serverError) {
      toast({ title: 'Something Went Wrong', description: formState.errors.serverError.message, variant: 'destructive' });
    }
    if (formState.result) {
      toast({ title: 'Success', description: 'Item was successfully added', variant: 'default' });
    }
    if (error) toast({ title: 'User Loading Was Failed', description: error.message, variant: 'destructive' });
  }, [formState, toast, error]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={(formData) => form.trigger().then(() => formAction(formData))}
        className='flex flex-col grid-cols-12 gap-2 p-4 mt-5 border rounded-lg md:px-4 focus-within:shadow-sm md:mx-64'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter a title' {...field} />
              </FormControl>
              <FormDescription>The title of the todo item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder='Enter a content' {...field} />
              </FormControl>
              <FormDescription>The content of the todo item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <AddButton />
      </form>
    </Form>
  );
};

const AddButton: React.FC = () => {
  const status = useFormStatus();
  const { isLoading } = useUser();
  return (
    <Button type='submit' size='sm' className='px-2.5 w-fit' disabled={status.pending || isLoading}>
      {status.pending || isLoading ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <PlusIcon className='w-4 h-4 mr-2' />}
      <span>Add</span>
    </Button>
  );
};
