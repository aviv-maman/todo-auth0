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
      <div className='flex items-center justify-end w-full pt-6 space-x-2'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm} className='flex justify-start w-[121px]'>
          {loading ? (
            <>
              <Loader2Icon className='h-4 animate-spin' />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <AlertTriangleIcon className='h-4' />
              <span>Continue</span>
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};
