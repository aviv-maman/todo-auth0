'use client';
import { useState } from 'react';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { WarningModal } from './warning-modal';

type DeleteTodoProps = {
  id: string;
};

export const DeleteTodo: React.FC<DeleteTodoProps> = ({ id }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/todo/${id}`, { method: 'DELETE' });
      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <WarningModal isOpen={open} onClose={() => setOpen(false)} onConfirm={handleDeleteProject} loading={loading} />
      <Button disabled={loading} variant='destructive' size='sm' onClick={() => setOpen(true)}>
        <Trash className='w-4 h-4' />
      </Button>
    </>
  );
};

export default DeleteTodo;
