'use server';

import { z } from 'zod';
import { SignInSchema, SignUpSchema } from '../types'
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';
import db from '@/lib/db/index';
import { userTable } from '@/lib/db/schema';
import { lucia, validateRequest } from '@/auth';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2'

export const SignUp = async (values: z.infer<typeof SignUpSchema>) => {

  const hashedPassword = await new Argon2id().hash(values.password)
  const userId = generateId(15);

  try {
    await db.insert(userTable).values({
      id: userId,
      username: values.username,
      hashedPassword
    }).returning({
      id: userTable.id,
      username: userTable.username
    })

    const session = await lucia.createSession(userId, {
      expiration: 60 * 60 * 24 * 30
    })

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return {
      success: true,
      data: {
        userId
      }
    }

  } catch (error: any) {
    console.error('error:', error);
    return {
      error: error?.message
    }
  }

}

export const SignIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    SignInSchema.parse(values)
  } catch (error: any) {
    console.error('error:', error);
    return {
      error: error?.message
    }
  }


  const existingUser = await db.query.userTable.findFirst({
    where: (table: any) => eq(table.username, values.username)
  })

  if (!existingUser || !existingUser.hashedPassword) {
    return {
      error: 'User not found'
    }
  }

  const isValidPassword = await argon2.verify(
    existingUser.hashedPassword,
    values.password
  )

  if (!isValidPassword) {
    return {
      error: 'Incorrect username or password'
    }
  }

  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30
  })

  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return {
    success: 'Logged in successfully'
  }
}

export const SignOut = async () => {
  try {
    const { session } = await validateRequest()

    if (!session) return { error: 'unauthorized' }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return {
      success: true
    }
  } catch (err: any) {
    console.error('error:', err);
    return {
      error: err?.message
    }
  }
}

