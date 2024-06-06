'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from './ui/use-toast';

const formSchema = z.object({
  title: z.string().min(2).max(500),
  content: z.string().min(2).max(500),
});

export const AddTodo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  type FormData = z.infer<typeof formSchema>;

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      setLoading(true);
      await axios.post(`/api/todo`, values);
      form.reset();
      toast({
        title: 'Todo Added',
        description: 'Todo Successfully Added',
        variant: 'default',
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to submit data',
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col w-full grid-cols-12 gap-2 px-2 py-4 mt-5 border rounded-lg md:px-4 focus-within:shadow-sm'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter a title' {...field} />
              </FormControl>
              <FormDescription>This the title of the todo item.</FormDescription>
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
              <FormDescription>This the content of the todo item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-5 w-fit' disabled={isLoading}>
          Add <Plus className='w-5 h-5 ml-5' />
        </Button>
      </form>
    </Form>
  );
};
