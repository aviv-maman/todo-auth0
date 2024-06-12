import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { UserIcon } from 'lucide-react';

async function Profile() {
  const session = await getSession();
  return (
    <>
      {session?.user && (
        <>
          <div className='flex flex-col items-center justify-between md:flex-row md:mx-64' data-testid='profile'>
            <div className='flex flex-col'>
              <Avatar style={{ marginBlockStart: 'auto' }}>
                <AvatarImage
                  src={String(session?.user.picture)}
                  alt='Profile'
                  decoding='async'
                  data-testid='profile-picture'
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
          </div>
          <div className='flex flex-col' data-testid='profile-json'>
            <div>{JSON.stringify(session?.user, null, 2)}</div>
          </div>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, { returnTo: '/' });
