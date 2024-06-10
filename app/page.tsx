import { Feed } from '@/components/feed';
import { Heading } from '@/components/heading';
import { AddTodoForm } from '@/components/todo-form';
import redis, { databaseName } from '@/lib/redis';
import type { TodoData } from '@/lib/database.types';

export default async function Home() {
  // const data = (await redis.hgetall(databaseName)) as TodoData;
  const data = [
    {
      id: '3imzSTaLpwmJH8V4c5TIfL4bZ',
      created_at: 1717712389603,
      updated_at: 1717713330721,
      title: 'Take the trash out 🗑️',
      content: 'The trash is piling up, take it out!',
      status: false,
    },
    {
      id: '9okfsKuYReRrNCG0PFarE',
      created_at: 1717699872618,
      updated_at: 1717699872618,
      title: 'Fix the sink 🚰',
      content: 'The sink is leaking, fix it asap!',
      status: false,
    },
    {
      id: 'B08A6z4Ueu1oTjh3vVpxi',
      created_at: 1717699691946,
      updated_at: 1717699691946,
      title: 'Buy groceries 🛒',
      content: 'Buy some milk and eggs',
      status: false,
    },
    {
      id: 'gG345mCxiT69dtKdgkpix92s',
      created_at: 1717709691946,
      updated_at: 1717709691946,
      title: 'Walk the dog 🐕',
      content: 'Its been a while since I took it out.',
      status: false,
    },
    {
      id: 'm67l4kdjf9SdkZXcxx3kf50fH',
      created_at: 1717699701946,
      updated_at: 1717699711946,
      title: 'Clean everything 🧹',
      content: 'My place is stinky and dirty... I should clean it.',
      status: false,
    },
  ] as unknown as TodoData;

  return (
    <>
      <div className='flex flex-col items-center justify-between md:flex-row md:mx-64'>
        <Heading
          title='Todo x Auth0 Application'
          description='Simple to do application with CRUD functionality and Auth0 authentication that was made with Upstash Redis and Next.js'
        />
      </div>
      <AddTodoForm />
      <Feed data={data} />
    </>
  );
}
