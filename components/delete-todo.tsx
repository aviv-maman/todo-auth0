'use client';
import { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from './ui/button';
import { WarningModal } from './warning-modal';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

type DeleteTodoProps = {
  id: string;
};

export const DeleteTodo: React.FC<DeleteTodoProps> = ({ id }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { refresh } = useRouter();
  const [deletionState, setDeletionState] = useState({
    result: null as string | null,
    error: null as { name: number | string; message: string } | null,
    pending: false,
  });

  const deleteTodo = async (id: string) => {
    const DOMAIN_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    setDeletionState(() => ({ result: null, error: null, pending: true }));
    try {
      const res = await fetch(`${DOMAIN_URL}/api/todo/${id}`, { method: 'DELETE' });
      if (!res.ok)
        setDeletionState(() => ({
          result: null,
          error: { name: res.status, message: 'Failed to delete item' },
          pending: false,
        }));
      const data = await res.json();
      setDeletionState(() => ({ result: data?.result, error: null, pending: false }));
      refresh();
    } catch (error: any) {
      setDeletionState(() => ({
        result: null,
        error: { name: error.status, message: 'Failed to delete item' },
        pending: false,
      }));
    }
  };

  useEffect(() => {
    if (deletionState.error)
      toast({ title: 'Something Went Wrong', description: deletionState.error.message, variant: 'destructive' });
    if (deletionState.result)
      toast({ title: 'Success', description: 'Item was successfully deleted', variant: 'default' });
  }, [deletionState.error, deletionState.result, toast]);

  return (
    <>
      <WarningModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteTodo(id).then(() => setOpen(false))}
        loading={deletionState.pending}
      />
      <Button
        disabled={deletionState.pending}
        variant='destructive'
        size='sm'
        className='px-2.5'
        onClick={() => setOpen(true)}>
        <Trash className='w-4 h-4' />
      </Button>
    </>
  );
};

export default DeleteTodo;
