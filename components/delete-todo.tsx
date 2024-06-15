'use client';
import { useState, useTransition } from 'react';
import { Trash } from 'lucide-react';
import { Button } from './ui/button';
import { WarningModal } from './warning-modal';

type DeleteTodoProps = {
  id: string;
};

export const DeleteTodo: React.FC<DeleteTodoProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <WarningModal id={id} startTransition={startTransition} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Button disabled={isPending} variant='destructive' size='sm' className='px-2.5' onClick={() => setIsOpen(true)}>
        <Trash className='w-4 h-4' />
      </Button>
    </>
  );
};

export default DeleteTodo;
