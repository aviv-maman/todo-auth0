'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckIcon, Loader2Icon, UserIcon, XIcon } from 'lucide-react';
import type { TodoData } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { EditTodoForm } from './edit-todo-form';
import DeleteTodo from './delete-todo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useFormState, useFormStatus } from 'react-dom';
import { markAsComplete } from '@/lib/actions/todo';
import { useEffect } from 'react';
import { useToast } from './ui/use-toast';

type TodoCardProps = React.ComponentProps<typeof Card> & {
  id: string;
  value: {
    created_at: number;
    updated_at: number;
    title: string;
    content: string;
    status: boolean;
  };
};

const TodoCard: React.FC<TodoCardProps> = ({ id, value, className, ...props }) => {
  const initialState = { result: null, error: null, id };
  const [formState, formAction] = useFormState(markAsComplete, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (formState.error)
      toast({ title: 'Something Went Wrong', description: formState.error.message, variant: 'destructive' });
    const status = !value.status ? 'complete' : 'incomplete';
    if (formState.result || formState.result === 0)
      toast({ title: 'Success', description: `Item was marked as ${status}`, variant: 'default' });
  }, [formState, toast]);

  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader className='flex-row justify-between p-2 pl-4'>
        <CardTitle className='content-center text-xl'>{value.title}</CardTitle>
        <Avatar style={{ marginBlockStart: 'auto' }}>
          <AvatarImage src='https://github.com/shadcn.pngx' />
          <AvatarFallback>
            <UserIcon className='h-5 w-5' />
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className='border-y space-x-4 p-4 text-sm text-muted-foreground'>{value.content}</CardContent>
      <CardFooter className='block md:flex p-4 md:justify-between'>
        <div className='flex space-x-2'>
          <form action={formAction}>
            <MarkAsCompleteButton id={id} status={value.status} />
          </form>
          <EditTodoForm id={id} value={value} />
          <DeleteTodo id={id} />
        </div>
        <CardDescription className='text-xs h-[40px] flex items-end'>
          Updated at {new Date(value.updated_at).toLocaleString()}
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default TodoCard;

type MarkAsCompleteButtonProps = { id: string; status: boolean };
const MarkAsCompleteButton: React.FC<MarkAsCompleteButtonProps> = ({ id, status: itemStatus }) => {
  const status = useFormStatus();
  const colorClasses = itemStatus
    ? 'bg-orange-600 dark:bg-orange-700 hover:bg-orange-500 hover:dark:bg-orange-800'
    : 'bg-green-600 dark:bg-green-700 hover:bg-green-500 hover:dark:bg-green-800';
  return (
    <Button
      id={`mark-as-complete-btn-${id}`}
      name='status'
      value={itemStatus ? 1 : 0}
      type='submit'
      size='sm'
      className={`${colorClasses} px-2.5 text-white`}
      disabled={status.pending}>
      {status.pending ? (
        <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />
      ) : itemStatus ? (
        <XIcon className='w-4 h-4 mr-2' />
      ) : (
        <CheckIcon className='w-4 h-4 mr-2' />
      )}
      <span>{itemStatus ? `Mark as incomplete` : `Mark as complete`}</span>
    </Button>
  );
};
