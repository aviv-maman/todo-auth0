'use client';
import { HomeIcon, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Link from 'next/link';

interface HamburgerMenuProps {
  components?: { title: string; href: string; description: string }[];
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ components }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon className='w-5 h-5 hover:cursor-pointer hover:text-indigo-300' />
      </SheetTrigger>
      <SheetContent side='left'>
        <div className='relative overflow-hidden h-[calc(100vh-8rem)] pb-10'>
          <div className='flex gap-x-2'>
            <HomeIcon className='h-5 w-5' />
            <div className='font-bold'>ToDoz</div>
          </div>
          <div className='flex flex-col space-y-3 pl-6'>
            <span className='mt-3 text-left w-fit'>Menu</span>
            {components?.map((component) => (
              <Link
                key={component.title}
                href={component.href}
                className='mt-3 text-left w-fit text-muted-foreground text-sm'>
                {component.title}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
