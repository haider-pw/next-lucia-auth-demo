import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import { emailVerificationTable, userTable } from '@/lib/db/schema';
import { lucia } from '@/auth';
import { cookies } from 'next/headers';
import React from 'react';

export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url)

    const searchParams = url.searchParams;

    const token = searchParams.get('token');

    if (!token) {
      return Response.json({
        error: 'Token not found'
      }, {
        status: 400
      })
    }

    const decoded = jwt.verify(
      token, process.env.JWT_SECRET!
    ) as {
      email: string,
      userId: string,
      code: string
    };

    const emailVerificationQueryResult = await db.query.emailVerificationTable.findFirst({
      where:
        eq(emailVerificationTable.userId, decoded.userId) &&
        eq(emailVerificationTable.code, decoded.code)
    })

    if (!emailVerificationQueryResult) {
      return Response.json({
        error: 'Invalid token, 1'
      }, {
        status: 400
      })
    }

    await db.delete(emailVerificationTable).where(
      eq(emailVerificationTable.userId, decoded.userId)
    )

    await db.update(userTable).set({
      isEmailVerified: true
    }).where(
      eq(userTable.email, decoded.email)
    )


    const session = await lucia.createSession(decoded.userId, {
      expiration: 60 * 60 * 24 * 30
    })

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return Response.redirect(new URL(process.env.NEXT_PUBLIC_BASE_URL!), 302)

  } catch (error: any) {
    return Response.json({
      error: error?.message
    }, {
      status: 400
    })
  }
}
