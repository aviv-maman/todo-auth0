'use client';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { AlertTriangleIcon, Loader2Icon } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { deleteTodoItem } from '@/lib/actions/todo';
import { deleteTodoFormInitialState } from '@/lib/schemas/todoFormSchema';

interface WarningModalProps {
  id: string;
  startTransition: React.TransitionStartFunction;
  isOpen: boolean;
  onClose: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({ id, startTransition, isOpen, onClose }) => {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  const deleteTodoItemWithId = deleteTodoItem.bind(null, id);
  const [formState, formAction] = useFormState(deleteTodoItemWithId, deleteTodoFormInitialState);

  useEffect(() => {
    setIsMounted(() => true);
  }, []);

  useEffect(() => {
    console.log(formState);
    if (formState.errors?.serverError) {
      toast({ title: 'Something Went Wrong', description: formState.errors.serverError.message, variant: 'destructive' });
    }
    if (formState.result) toast({ title: 'Success', description: 'Item was successfully deleted', variant: 'default' });
  }, [formState, toast]);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Are you sure?'
      description='All associated data related with this post will be DELETED forever.'
      isOpen={isOpen}
      onClose={onClose}>
      <form
        action={() =>
          startTransition(() => {
            formAction();
            onClose();
          })
        }>
        <div className='flex items-center justify-end w-full space-x-2'>
          <CancelButton onClose={onClose} />
          <DeleteButton />
        </div>
      </form>
    </Modal>
  );
};

const DeleteButton: React.FC = () => {
  const status = useFormStatus();
  return (
    <Button type='submit' disabled={status.pending} variant='destructive' className='px-2.5 w-fit'>
      {status.pending ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <AlertTriangleIcon className='w-4 h-4 mr-2' />}
      <span>Delete</span>
    </Button>
  );
};

const CancelButton: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const status = useFormStatus();
  return (
    <Button type='button' disabled={status.pending} variant='outline' onClick={onClose}>
      Cancel
    </Button>
  );
};
