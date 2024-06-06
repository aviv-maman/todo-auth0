'use client';
import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const establishedYear = 2024;
  const currentYear = new Date().getFullYear();
  const range = currentYear > establishedYear ? `${establishedYear}-${currentYear}` : `${establishedYear}`;

  return (
    <footer className='mx-auto px-6 border-neutral-200 dark:border-neutral-800 border-t bg-neutral-100 dark:bg-zinc-950'>
      <div className='flex flex-col items-center justify-between py-3 sm:py-6 md:flex-row container'>
        <div className='text-sm pb-3 lg:pb-0'>
          <span>&copy; {range} Todoz. All rights reserved.</span>
        </div>
        <div className='flex items-center gap-1'>
          <Link href='https://github.com/aviv-maman/todo-auth0' target='_blank' referrerPolicy='no-referrer'>
            <Button
              aria-label='GitHub'
              variant='ghost'
              size='icon'
              className='hover:bg-neutral-300 dark:hover:bg-neutral-800 h-9 w-9'>
              <Github className='w-5 h-5' />
            </Button>
          </Link>
          <Link href='https://www.linkedin.com/in/aviv-maman-914a95223' target='_blank' referrerPolicy='no-referrer'>
            <Button
              aria-label='LinkedIn'
              variant='ghost'
              size='icon'
              className='hover:bg-neutral-300 dark:hover:bg-neutral-800 h-9 w-9'>
              <Linkedin className='w-5 h-5 text-blue-600' />
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
