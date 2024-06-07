'use client';
import { useEffect, useState, useTransition } from 'react';
import { Trash } from 'lucide-react';
import { Button } from './ui/button';
import { WarningModal } from './warning-modal';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { fakeDelay } from '@/app/actions/todo';

type DeleteTodoProps = {
  id: string;
};

export const DeleteTodo: React.FC<DeleteTodoProps> = ({ id }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { refresh } = useRouter();
  const [deletionState, setDeletionState] = useState({ result: null as string | null, error: null as string | null });

  const deleteTodo = async (id: string) => {
    const DOMAIN_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    setDeletionState(() => ({ result: null, error: null }));
    try {
      const res = await fetch(`${DOMAIN_URL}/api/todo/${id}`, { method: 'DELETE' });
      if (!res.ok) setDeletionState(() => ({ result: null, error: 'Failed to delete todo' }));
      const data = await res.json();
      setDeletionState(() => ({ result: data?.result, error: data?.error }));
      refresh();
    } catch (error) {
      console.error('error in deleteTodo', error);
    }
  };

  useEffect(() => {
    if (deletionState.error)
      toast({ title: 'Something Went Wrong', description: deletionState.error, variant: 'destructive' });
    if (deletionState.result)
      toast({ title: 'Success', description: 'Item Was Successfully Deleted', variant: 'default' });
  }, [deletionState.error, deletionState.result, toast]);

  return (
    <>
      <WarningModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          startTransition(() => {
            fakeDelay(2000).then(() => deleteTodo(id));
          });
        }}
        loading={pending}
      />
      <Button disabled={pending} variant='destructive' size='sm' onClick={() => setOpen(true)}>
        <Trash className='w-4 h-4' />
      </Button>
    </>
  );
};

export default DeleteTodo;
