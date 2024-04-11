import React from 'react';
import SignUpForm from '@/app/(components)/SignUpForm';
import Link from 'next/link';


const SignUp = () => {
  return (
    <div className="flex flex-col gap-10 justify-center min-h-screen items-center">
      <h1 className="text-4xl">Register</h1>
      <div className="flex justify-center items-center">
        <SignUpForm />
      </div>
      <span>
        Already have an account? <Link className="text-blue-500" href="/SignIn"> Sign In </Link>
      </span>
    </div>
  );
};

export default SignUp;
