'use client';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { InfoIcon } from 'lucide-react';
import { Button } from './ui/button';

interface HoverInfoProps {
  user?: any;
}

export const HoverInfo: React.FC<HoverInfoProps> = ({ user }) => {
  return (
    <HoverCard openDelay={250}>
      <HoverCardTrigger>
        <Button variant='link'>
          <InfoIcon className='w-5 h-5' />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>The React Framework U+2013 created and maintained by @vercel.</HoverCardContent>
    </HoverCard>
  );
};
