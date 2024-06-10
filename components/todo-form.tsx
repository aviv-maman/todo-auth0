'use client';
import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from './ui/use-toast';
import { addTodoItem } from '@/app/actions/todo';

const formSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string().min(2).max(250),
});

export const AddTodoForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  // const formRef = useRef<HTMLFormElement | null>(null);

  const initialState = { result: null, error: null };
  const [formState, formAction] = useFormState(addTodoItem, initialState);

  useEffect(() => {
    if (formState.error)
      toast({ title: 'Something Went Wrong', description: formState.error.message, variant: 'destructive' });
    if (formState.result) toast({ title: 'Success', description: 'Item Was Successfully Added', variant: 'default' });
  }, [formState, toast]);

  return (
    <Form {...form}>
      <form
        action={formAction}
        // ref={formRef}
        // onSubmit={form.handleSubmit(() => formRef.current && formAction(new FormData(formRef.current)))}
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
  return (
    <Button type='submit' size='sm' className='px-2.5 w-fit' disabled={status.pending}>
      {status.pending ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <PlusIcon className='w-4 h-4 mr-2' />}
      <span>Add</span>
    </Button>
  );
};
