'use client';

import React from 'react';
import Link from 'next/link';
import SignInForm from '@/app/(components)/SignInForm';
import { Button } from '@/components/ui/button';
import { createGoogleAuthorizationURL } from '@/app/actions/auth.actions';
import { toast } from '@/components/ui/use-toast';


const SignIn = () => {

  const onGoogleSignInClicked = async () => {
    console.log('Google Sign In Clicked');
    const res = await createGoogleAuthorizationURL()

    if (res.error) {
      toast({
        variant: 'destructive',
        description: res.error
      })
    } else if (res.success) {
      window.location.href = res.data.toString();
    }
  }

  return (
    <div className="flex flex-col gap-10 justify-center min-h-screen items-center">
      <h1 className="text-4xl">Sign In</h1>
      <div className="w-full flex justify-center items-center">
        <Button onClick={onGoogleSignInClicked} variant={'outline'}>
          Sign In with Google
        </Button>
      </div>
      <div className="flex justify-center items-center">
        <SignInForm />
      </div>
      <span>
        Done have an Account? <Link className="text-blue-500" href="/Register"> Register </Link>
      </span>

    </div>
  );
};

export default SignIn;
