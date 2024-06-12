import { Suspense } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import SpinnerWave from '@/components/spinner-wave';
import ProfileCard from '@/components/profile-card';

async function Profile() {
  return (
    <div className='flex flex-col items-center justify-between md:flex-row md:mx-64' data-testid='profile'>
      <Suspense fallback={<SpinnerWave />}>
        <ProfileCard />
      </Suspense>
    </div>
  );
}

export default withPageAuthRequired(Profile, { returnTo: '/' });
