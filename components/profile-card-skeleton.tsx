import { Skeleton } from '@/components/ui/skeleton';

export const ProfileCardSkeleton: React.FC = () => {
  return (
    <div className='w-full md:flex border rounded-md'>
      <Skeleton className='rounded-t-md md:rounded-tr-none md:rounded-l-md self-center md:self-start flex-shrink-0 w-full h-64 md:w-64' />
      <div className='flex flex-col p-4 gap-y-2 w-full'>
        <Skeleton className='h-12' />
        <Skeleton className='h-5' />
        <Skeleton className='h-5' />
      </div>
    </div>
  );
};
