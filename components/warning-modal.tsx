'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { AlertTriangleIcon, Loader2Icon } from 'lucide-react';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const WarningModal: React.FC<WarningModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Are you sure?'
      description='All associated data related with this post will be DELETED forever.'
      isOpen={isOpen}
      onClose={onClose}>
      <div className='flex items-center justify-end w-full space-x-2'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm} className='px-2.5 w-fit'>
          {loading ? (
            <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />
          ) : (
            <AlertTriangleIcon className='w-4 h-4 mr-2' />
          )}
          <span>Delete</span>
        </Button>
      </div>
    </Modal>
  );
};
