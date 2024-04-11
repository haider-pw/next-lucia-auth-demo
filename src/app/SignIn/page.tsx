import React from 'react';
import Link from 'next/link';
import SignInForm from '@/app/(components)/SignInForm';


const SignIn = () => {
  return (
    <div className="flex flex-col gap-10 justify-center min-h-screen items-center">
      <h1 className="text-4xl">Sign In</h1>
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
