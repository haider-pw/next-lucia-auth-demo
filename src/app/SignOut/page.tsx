'use client';
import { useEffect } from 'react';
import { SignOut } from '@/app/actions/auth.actions';
import { useRouter } from 'next/navigation';

const SignOutPage = () => {

  const router = useRouter();

  useEffect(() => {
    SignOut()
      .then(() => {
        console.log('SignOutPage success');
        router.push('/')
      })
      .catch((error) => {
        console.error('SignOutPage error:', error);
      })
  }, []);

  return null; // Render nothing
};

export default SignOutPage;
