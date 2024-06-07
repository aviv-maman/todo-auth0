import type { TodoData } from '@/lib/database.types';
import { CardContent } from './ui/card';
import TodoCard from './todo-card';

interface FeedProps {
  data?: TodoData;
}

export const Feed: React.FC<FeedProps> = ({ data = [] }) => {
  const completedTodos = Object.entries(data).filter(([key, value]) => value.status);
  const incompleteTodos = Object.entries(data).filter(([key, value]) => !value.status);

  return data ? (
    <div className='flex flex-col w-full mt-10 overflow-hidden lg:flex-row md:justify-evenly'>
      <div className='w-full md:min-w-[350px] flex flex-col items-center md:mx-64'>
        <h2 title='Incomplete' className='text-center border rounded text-2xl font-bold tracking-tight py-2 px-4'>
          Incomplete
        </h2>
        <CardContent id='feed-content' className='w-full p-0 md:pt-0'>
          {incompleteTodos.map(([id, value]) => (
            <TodoCard key={id} id={id} value={value} className='mt-6' />
          ))}
        </CardContent>
      </div>
      {/* <Card className='md:min-w-[350px] mt-5 lg:mt-0 w-1/2'>
        <CardHeader className='text-center'>Complete</CardHeader>
        {completedTodos.map(([id, value]) => (
          <TodoCard key={id} id={id} value={value} />
        ))}
      </Card> */}
    </div>
  ) : (
    <div className='flex flex-col w-full mt-10 overflow-hidden lg:flex-row md:justify-evenly'>
      <h1 className='text-center'>Create your first todo to get started</h1>
    </div>
  );
};
