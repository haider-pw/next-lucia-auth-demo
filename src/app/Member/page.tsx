import React from 'react';
import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';

async function Member () {
  const { user, session } = await validateRequest();

  if (!user) {
    return redirect('/SignIn');
  }

  return (
    <div>

      Member: {JSON.stringify(user)}
      <br />
      Session: {JSON.stringify(session)}

    </div>
  );
}

export default Member;
