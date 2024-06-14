import { Suspense } from 'react';
import { Feed } from '@/components/feed';
import { Heading } from '@/components/heading';
import { AddTodoForm } from '@/components/add-todo-form';
import { FeedSkeleton } from '@/components/feed-skeleton';

export default async function Home() {
  return (
    <>
      <div className='flex flex-col items-center justify-between md:flex-row md:mx-64'>
        <Heading
          title='Todo x Auth0 Application'
          description='Simple to do application with CRUD functionality and Auth0 authentication that was made with Upstash Redis and Next.js'
        />
      </div>
      <AddTodoForm />
      <Suspense fallback={<FeedSkeleton />}>
        <Feed />
      </Suspense>
    </>
  );
}
