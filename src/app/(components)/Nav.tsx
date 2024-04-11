import React from 'react';
import Link from 'next/link';
import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import { SignOut } from '@/app/actions/auth.actions';
import { Button } from '@/components/ui/button';
// import { options } from '@/app/api/auth/[...nextauth]/options';

const Nav = async () => {

  const { user, session } = await validateRequest();

  // if (!user) {
  //   return redirect('/SignIn');
  // }

  return (
    <header className="bg-gray-600 text-gray-100">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div>My Site</div>
        <div className="flex gap-10">
          <Link href="/">Home </Link>
          <Link href="/CreateUser">Create User </Link>
          <Link href="/ClientMember">Client Member </Link>
          <Link href="/Member">Member </Link>
          <Link href="/Public">Public </Link>
          {session ?
            (<Link href="/SignOut"> Logout </Link>) :
            (<Link href="/SignIn">Login</Link>)
          }
        </div>
      </nav>
    </header>
  );
};

export default Nav;
