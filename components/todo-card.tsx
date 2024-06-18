'use client';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { CheckIcon, Loader2Icon, UserIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditTodoForm } from './edit-todo-form';
import DeleteTodo from './delete-todo';
import { markAsComplete } from '@/lib/actions/todo';
import { useToast } from './ui/use-toast';
import { useUser } from '@auth0/nextjs-auth0/client';
import { markAsCompleteFormInitialState } from '@/lib/schemas/todoFormSchema';

type TodoCardProps = React.ComponentProps<typeof Card> & {
  id: string;
  value: {
    created_at: number;
    updated_at: number;
    title: string;
    content: string;
    status: boolean;
    owner_id: string | null;
    owner_email: string | null;
    owner_name: string | null;
    owner_picture: string | null;
  };
};

const TodoCard: React.FC<TodoCardProps> = ({ id, value, className, ...props }) => {
  const markAsCompleteWithId = markAsComplete.bind(null, id);
  const [formState, formAction] = useFormState(markAsCompleteWithId, markAsCompleteFormInitialState);
  const { toast } = useToast();
  const { error, isLoading, user } = useUser();

  useEffect(() => {
    console.log(formState);

    if (formState.errors?.serverError) {
      toast({ title: 'Something Went Wrong', description: formState.errors.serverError.message, variant: 'destructive' });
    }
    const status = !value.status ? 'complete' : 'incomplete';
    if (formState.result || formState.result === 0)
      toast({ title: 'Success', description: `Item was marked as ${status}`, variant: 'default' });
  }, [formState, toast]);

  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader className='block sm:flex flex-row justify-between p-4 space-y-2 sm:space-y-0'>
        <CardTitle className='content-center text-xl'>{value.title}</CardTitle>
        <div className='flex max-h-10 space-y-2 gap-x-2 items-center text-base flex-row-reverse sm:flex-row justify-end'>
          <span>{value.owner_name || 'Guest'}</span>
          <Avatar style={{ marginBlockStart: 0 }}>
            <AvatarImage src={value.owner_picture || undefined} />
            <AvatarFallback>
              <UserIcon className='h-5 w-5' />
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className='border-y space-x-4 p-4 text-sm text-muted-foreground'>{value.content}</CardContent>
      <CardFooter className='w-full h-auto p-4'>
        <div className='flex flex-col h-full justify-between space-y-4'>
          <div className='flex space-x-2'>
            {(user?.sub?.split('|')[1] === value.owner_id || !value.owner_id) && (
              <>
                <form action={formAction}>
                  <MarkAsCompleteButton id={id} status={value.status} />
                </form>
                <EditTodoForm id={id} value={value} />
                <DeleteTodo id={id} />
              </>
            )}
          </div>
          <CardDescription className='text-xs'>Updated at {new Date(value.updated_at).toLocaleString()}</CardDescription>
        </div>
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
      value={itemStatus ? 0 : 1}
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
