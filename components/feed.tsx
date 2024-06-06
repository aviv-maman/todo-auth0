import type { TodoData } from '@/lib/database.types';
import { Card, CardHeader } from './ui/card';
import TodoCard from './todo-card';

interface FeedProps {
  data?: TodoData;
}

export const Feed: React.FC<FeedProps> = ({ data = [] }) => {
  const completedTodos = Object.entries(data).filter(([key, value]) => value.status);
  const incompleteTodos = Object.entries(data).filter(([key, value]) => !value.status);

  return data ? (
    <div className='flex flex-col w-full mt-10 overflow-hidden lg:flex-row md:justify-evenly'>
      <Card className='md:min-w-[350px] w-1/2'>
        <CardHeader className='text-center'>Incomplete</CardHeader>
        {incompleteTodos.map(([id, value]) => (
          <TodoCard key={id} id={id} value={value} />
        ))}
      </Card>
      <Card className='md:min-w-[350px] mt-5 lg:mt-0 w-1/2'>
        <CardHeader className='text-center'>Complete</CardHeader>
        {completedTodos.map(([id, value]) => (
          <TodoCard key={id} id={id} value={value} />
        ))}
      </Card>
    </div>
  ) : (
    <div className='flex flex-col w-full mt-10 overflow-hidden lg:flex-row md:justify-evenly'>
      <h1 className='text-center'>Create your first todo to get started</h1>
    </div>
  );
};
