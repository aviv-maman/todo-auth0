import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { fakeDelay } from '@/lib/actions/todo';
import { getSession } from '@auth0/nextjs-auth0';
import { MailIcon, PersonStandingIcon } from 'lucide-react';
import Image from 'next/image';

type TodoCardProps = React.ComponentProps<typeof Card>;

const ProfileCard: React.FC<TodoCardProps> = async ({ className, ...props }) => {
  const session = await fakeDelay(1000).then(() => getSession());

  return (
    <Card className={cn('w-full md:flex', className)} {...props}>
      <Image
        className='object-cover object-center rounded-t-md md:rounded-tr-none md:rounded-l-md self-center md:self-start flex-shrink-0 w-full h-64 md:w-64'
        src={session?.user.picture || '/images/avatar.png'}
        alt='avatar'
        width={224}
        height={224}
      />

      <div className='flex flex-col p-4 gap-y-2 w-full'>
        <div className='flex items-center py-3 bg-sky-900'>
          <h1 className='mx-3 text-lg font-semibold text-white'>{session?.user.name}</h1>
        </div>
        <div className='flex items-center text-gray-700 dark:text-gray-200'>
          <PersonStandingIcon className='mr-2 w-5 h-5' />
          <span className='text-sm text-gray-700 dark:text-gray-400'>Nickname:</span>
          <h1 className='px-2 text-sm'>{session?.user.nickname}</h1>
        </div>
        <div className='flex items-center text-gray-700 dark:text-gray-200'>
          <MailIcon className='mr-2 w-5 h-5' />
          <span className='text-sm text-gray-700 dark:text-gray-400'>Email:</span>
          <h1 className='px-2 text-sm'>{session?.user.email}</h1>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
