import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { fakeDelay } from '@/lib/actions/todo';
import { getSession } from '@auth0/nextjs-auth0';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserIcon } from 'lucide-react';

type TodoCardProps = React.ComponentProps<typeof Card>;

const ProfileCard: React.FC<TodoCardProps> = async ({ className, ...props }) => {
  const session = await fakeDelay(3000).then(() => getSession());

  return (
    <Card className={cn('w-full', className)} {...props}>
      <div className='flex flex-col' key={session?.user.sid}>
        <Avatar style={{ marginBlockStart: 'auto' }}>
          <AvatarImage
            src={String(session?.user.picture)}
            alt='Profile'
            decoding='async'
            data-testid='profile-picture'
            className='rounded-md'
          />
          <AvatarFallback>
            <UserIcon className='h-5 w-5' />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className='flex'>
        <h2 data-testid='profile-name'>{session?.user.name}</h2>
        <p className='lead text-muted' data-testid='profile-email'>
          {session?.user.email}
        </p>
      </div>
    </Card>
  );
};

export default ProfileCard;
