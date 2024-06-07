'use client';
import DeleteTodo from './delete-todo';
import { EditTodoForm } from './edit-todo-form';
import { CardContent } from './ui/card';
import type { TodoData } from '@/lib/database.types';

interface TodoCardProps {
  id: string;
  value: {
    created_at: number;
    updated_at: number;
    title: string;
    content: string;
    status: boolean;
  };
}

const TodoCard: React.FC<TodoCardProps> = ({ id, value }) => {
  return (
    <>
      <CardContent key={id} className='flex items-center justify-start max-w-xl text-center'>
        <div className='flex items-center justify-between w-full p-3 border rounded-lg'>
          <div className='w-2/3'>
            <h1>{value.title}</h1>
          </div>

          <div className='flex w-fill w-[80px] justify-between items-center'>
            <EditTodoForm id={id} value={value} />
            <DeleteTodo id={id} />
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default TodoCard;
