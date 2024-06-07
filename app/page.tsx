import { Feed } from '@/components/feed';
import { Heading } from '@/components/heading';
import { AddTodoForm } from '@/components/todo-form';
import redis, { databaseName } from '@/lib/redis';
import type { TodoData } from '@/lib/database.types';
import { HoverInfo } from '@/components/hover-info';

export default async function Home() {
  const data = (await redis.hgetall(databaseName)) as TodoData;

  return (
    <>
      <div className='flex flex-col items-center justify-between w-full md:flex-row'>
        <Heading
          title='Todo x Auth0 Application'
          description='Simple Todo application with CRUD functionality made with Upstash Redis and Next.js'
          source='https://github.com'
        />
        <HoverInfo />
      </div>
      <AddTodoForm />
      <Feed data={data} />
    </>
  );
}
