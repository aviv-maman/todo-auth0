'use client';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { GithubIcon, HomeIcon, LinkedinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme-toggle';
import { HamburgerMenu } from './hamburger-menu';
import { useUser } from '@auth0/nextjs-auth0/client';

export const Header: React.FC = () => {
  const guestComponents: { title: string; href: string; description: string }[] = [
    {
      title: 'Sign In',
      href: '/api/auth/login',
      description: 'Login to an existing account or register a new account.',
    },
  ];
  const userComponents: { title: string; href: string; description: string }[] = [
    {
      title: 'Profile',
      href: '/profile',
      description: 'Your user profile.',
    },
    {
      title: 'Logout',
      href: '/api/auth/logout',
      description: 'Logout the current session.',
    },
  ];

  const { user, isLoading } = useUser();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='px-4 md:px-8 container flex h-14 max-w-screen-2xl items-center'>
        <div className='mr-4 hidden md:flex'>
          <div className='mr-6 flex items-center space-x-2'>
            <Link href='/' className='mr-6 flex items-center space-x-2' passHref>
              <HomeIcon className='h-5 w-5' />
              <span>ToDoz</span>
            </Link>
          </div>
          <NavigationMenu>
            <NavigationMenuList className='hidden sm:flex'>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                    <li className='row-span-3'>
                      <NavigationMenuLink asChild>
                        <div className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'>
                          <HomeIcon className='h-6 w-6' />
                          <div className='mb-2 mt-4 text-lg font-medium'>ToDoz</div>
                          <p className='text-sm leading-tight text-muted-foreground'>Next.js. Auth0. Open Source.</p>
                        </div>
                      </NavigationMenuLink>
                    </li>
                    {user
                      ? userComponents.map((component) => (
                          <ListItem key={component.title} title={component.title} href={component.href}>
                            {component.description}
                          </ListItem>
                        ))
                      : guestComponents.map((component) => (
                          <ListItem key={component.title} title={component.title} href={component.href}>
                            {component.description}
                          </ListItem>
                        ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/about' legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* MOBILE */}
        <div className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'>
          <HamburgerMenu components={user ? userComponents : guestComponents} />
          <span className='sr-only'>Toggle Menu</span>
        </div>

        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <nav className='flex items-center space-x-2'>
            <Link href='https://github.com/aviv-maman/todo-auth0' target='_blank' referrerPolicy='no-referrer'>
              <Button aria-label='GitHub' variant='outline' size='icon' className='h-9 w-9'>
                <GithubIcon className='w-5 h-5' />
              </Button>
            </Link>
            <Link href='https://www.linkedin.com/in/aviv-maman-914a95223' target='_blank' referrerPolicy='no-referrer'>
              <Button aria-label='LinkedIn' variant='outline' size='icon' className='h-9 w-9'>
                <LinkedinIcon className='w-5 h-5' />
              </Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

const ListItem = forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}>
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
