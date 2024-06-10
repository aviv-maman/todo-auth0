import type { TodoData } from '@/lib/database.types';
import { Card, CardContent } from './ui/card';
import TodoCard from './todo-card';

interface FeedProps {
  data?: TodoData;
}

export const Feed: React.FC<FeedProps> = ({ data = [] }) => {
  const incompleteTodos = Object.entries(data).filter(([key, value]) => !value.status);
  const completedTodos = Object.entries(data).filter(([key, value]) => value.status);

  return data ? (
    <div
      id='feed-both'
      className='flex flex-col w-full overflow-hidden lg:flex-row md:justify-evenly md:mx-16 md:space-x-4'>
      <div id='feed-incomplete' className='w-full md:min-w-[350px] flex flex-col items-center mt-6'>
        <h2 title='Incomplete' className='text-center border rounded text-2xl font-bold tracking-tight py-2 px-4'>
          Incomplete
        </h2>
        {incompleteTodos.length ? (
          <CardContent id='feed-content-incomplete' className='w-full p-0 md:pt-0'>
            {incompleteTodos.map(([id, value]) => (
              <TodoCard key={id} id={id} value={value} className='mt-6' />
            ))}
          </CardContent>
        ) : (
          <Card className='mt-6 text-center content-center h-[240px] md:h-[184px] w-full'>
            <span>No incomplete tasks</span>
          </Card>
        )}
      </div>
      <div id='feed-complete' className='w-full md:min-w-[350px] flex flex-col items-center mt-6'>
        <h2 title='Complete' className='text-center border rounded text-2xl font-bold tracking-tight py-2 px-4'>
          Complete
        </h2>
        {completedTodos.length ? (
          <CardContent id='feed-content-complete' className='w-full p-0 md:pt-0'>
            {completedTodos.map(([id, value]) => (
              <TodoCard key={id} id={id} value={value} className='mt-6' />
            ))}
          </CardContent>
        ) : (
          <Card className='mt-6 text-center content-center h-[240px] md:h-[184px] w-full'>
            <span>No complete tasks yet</span>
          </Card>
        )}
      </div>
    </div>
  ) : (
    <div className='flex flex-col w-full mt-10 overflow-hidden lg:flex-row md:justify-evenly'>
      <h1 className='text-center'>Create your first todo to get started</h1>
    </div>
  );
};
