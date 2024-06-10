'use client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { CodeXmlIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface HoverInfoProps {
  user?: any;
}

export const HoverInfo: React.FC<HoverInfoProps> = ({ user }) => {
  return (
    <HoverCard openDelay={250}>
      <HoverCardTrigger>
        <Button variant='link'>
          <CodeXmlIcon className='w-5 h-5' />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='text-sm'>
        Source code can be found on{' '}
        <Link
          href={'https://github.com/aviv-maman/todo-auth0'}
          className='text-sm underline text-muted-foreground hover:cursor-pointer hover:text-indigo-400'>
          GitHub
        </Link>
        .
      </HoverCardContent>
    </HoverCard>
  );
};
