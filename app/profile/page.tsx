import { Suspense } from 'react';
import ProfileCard from '@/components/profile-card';
import { ProfileCardSkeleton } from '@/components/profile-card-skeleton';

async function Profile() {
  return (
    <div className='flex flex-col items-center justify-between md:flex-row md:mx-64' data-testid='profile'>
      <Suspense fallback={<ProfileCardSkeleton />}>
        <ProfileCard />
      </Suspense>
    </div>
  );
}

export default Profile;
