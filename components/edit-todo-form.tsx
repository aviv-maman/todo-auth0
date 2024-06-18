'use client';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2Icon, PencilIcon, PencilRulerIcon } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Switch } from './ui/switch';
import { useToast } from './ui/use-toast';
import { editTodoItem } from '@/lib/actions/todo';
import { type TodoFormSchema, todoFormSchema, todoFormInitialState } from '@/lib/schemas/todoFormSchema';

interface EditTodoFormProps {
  id: string;
  value: {
    created_at: number;
    updated_at: number;
    title: string;
    content: string;
    status: boolean;
  };
}

export const EditTodoForm: React.FC<EditTodoFormProps> = ({ id, value }) => {
  const { toast } = useToast();
  const [closeEditDialog, setCloseEditDialog] = useState(false);
  const form = useForm<TodoFormSchema>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: value.title,
      content: value.content,
      status: value.status,
    },
  });

  const editTodoItemWithId = editTodoItem.bind(null, id);
  const [formState, formAction] = useFormState(editTodoItemWithId, todoFormInitialState);

  useEffect(() => {
    if (formState.errors?.serverError) {
      toast({ title: 'Something Went Wrong', description: formState.errors.serverError.message, variant: 'destructive' });
    }
    if (formState.result || formState.result === 0) {
      toast({ title: 'Success', description: 'Item was successfully updated', variant: 'default' });
      setCloseEditDialog(() => false);
    }
  }, [formState, toast]);

  return (
    <>
      <Sheet open={closeEditDialog} onOpenChange={setCloseEditDialog}>
        <SheetTrigger asChild>
          <Button size='sm' className='px-2.5 bg-blue-700 dark:bg-blue-800 hover:bg-blue-600 hover:dark:bg-blue-900 text-white'>
            <PencilIcon className='w-4 h-4' />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <Form {...form}>
            <form
              action={(formData) => form.trigger().then(() => formAction(formData))}
              className='flex flex-col w-full grid-cols-12 gap-2 px-2 py-4 mt-5 border rounded-lg md:px-4 focus-within:shadow-sm'>
              <Label htmlFor='todo' className='mt-3 text-left w-fit'>
                Task
              </Label>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='What needs to be done?' {...field} />
                    </FormControl>
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
                      <Input placeholder='What needs to be done?' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label htmlFor='status' className='mt-3 text-left w-fit'>
                Status
              </Label>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch name='status' checked={field.value} onCheckedChange={(checked) => form.setValue('status', checked)} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>{field.value ? 'Done' : 'Not Done'}</FormLabel>
                      <FormDescription>{field.value ? 'Task Completed' : 'Task ongoing'}</FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <EditButton />
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

const EditButton: React.FC = () => {
  const status = useFormStatus();
  return (
    <Button type='submit' size='sm' className='px-2.5 w-fit' disabled={status.pending}>
      {status.pending ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <PencilRulerIcon className='w-4 h-4 mr-2' />}
      <span>Update</span>
    </Button>
  );
};
