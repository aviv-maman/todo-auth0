import { Skeleton } from '@/components/ui/skeleton';

export const FeedSkeleton: React.FC = () => {
  return (
    <div id='feed-both' className='flex flex-col w-full overflow-hidden lg:flex-row md:justify-evenly'>
      <div id='feed-incomplete' className='w-full md:min-w-[350px] flex flex-col items-center mt-6 md:mr-3'>
        <h2 title='Incomplete' className='text-center border rounded text-2xl font-bold tracking-tight py-2 px-4'>
          Incomplete
        </h2>
        <CardSkeleton renderNum={5} />
      </div>
      <div id='feed-complete' className='w-full md:min-w-[350px] flex flex-col items-center mt-6 md:ml-3'>
        <h2 title='Complete' className='text-center border rounded text-2xl font-bold tracking-tight py-2 px-4'>
          Complete
        </h2>
        <Skeleton id='feed-content-complete' className='w-full p-0 md:pt-0' />
        <CardSkeleton renderNum={5} />
      </div>
    </div>
  );
};

const CardSkeleton: React.FC<{ renderNum?: number }> = ({ renderNum = 3 }) => {
  return [...Array(renderNum)].map((_, i) => (
    <div key={i} id={`card-skeleton-${i}`} className='w-full border rounded-lg mt-6'>
      <div
        id={`card-header-skeleton-${i}`}
        className='block sm:flex flex-row justify-between p-4 border-b space-y-2 sm:space-y-0'>
        <Skeleton className='w-2/3 sm:w-1/3 h-7 self-center' />
        <div className='flex gap-x-2 items-center text-base flex-row-reverse sm:flex-row justify-end'>
          <Skeleton className='h-6 w-36' />
          <Skeleton className='h-10 w-10 rounded-full' />
        </div>
      </div>
      <div id={`card-content-skeleton-${i}`} className='w-full border-b h-auto p-4 space-y-2'>
        <Skeleton className='h-5 w-4/5' />
        {/* <Skeleton className='h-5 w-3/5' /> */}
      </div>
      <div id={`card-footer-skeleton-${i}`} className='w-full h-auto p-4'>
        <div className='flex flex-col h-full justify-between space-y-4'>
          <div className='flex space-x-2'>
            <Skeleton className='h-9 w-40' />
            <Skeleton className='h-9 w-9' />
            <Skeleton className='h-9 w-9' />
          </div>
          <Skeleton className='h-4 w-48' />
        </div>
      </div>
    </div>
  ));
};
