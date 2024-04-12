import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { google } from '@/lib/lucia/oauth';
import db from '@/lib/db/index';
import { oauthAccountTable, userTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { lucia } from '@/auth';


interface GoogleUser {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  picture: string
  locale: string
}


export const GET = async (request: NextRequest) => {
  try {
    const url = request.nextUrl
    const searchParams = url.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return Response.json({ error: 'Invalid request, Code/State not set' }, { status: 400 })
    }

    const codeVerifier = cookies().get('codeVerifier')?.value
    const savedState = cookies().get('state')?.value

    if (!codeVerifier || !savedState || state !== savedState) {
      return Response.json({ error: 'Invalid request, 2' }, { status: 400 })
    }

    const {
      accessToken,
      idToken,
      refreshToken,
      accessTokenExpiresAt
    } = await google.validateAuthorizationCode(code, codeVerifier)

    const googleRes = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        method: 'GET'
      });

    console.log({ accessToken, idToken, accessTokenExpiresAt, refreshToken })

    const googleData = (await googleRes.json()) as GoogleUser

    console.log('google data', googleData)

    await db.transaction(async (trx: typeof db) => {

      const user = await trx.query.userTable.findFirst({
        where: eq(userTable.id, googleData.id)
      })

      if (!user) {
        const createdUserRes = await trx.insert(userTable).values({
          email: googleData.email,
          id: googleData.id,
          name: googleData.name,
          profilePictureUrl: googleData.picture
        })
          .returning({
            id: userTable.id
          })

        if (createdUserRes.rowCount === 0) {
          trx.rollback();
          return Response.json({ error: true, message: 'Failed to create user' }, { status: 500 })
        }

        const createdOAuthAccountRes = await trx.insert(oauthAccountTable).values({
          accessToken,
          expiresAt: accessTokenExpiresAt,
          id: googleData.id,
          provider: 'google',
          providerUserId: googleData.id,
          userId: googleData.id,
          refreshToken
        })

        if (createdOAuthAccountRes.rowCount === 0) {
          trx.rollback();
          return Response.json({ error: true, message: 'Failed to create oauth account' }, { status: 500 })
        }
      } else {
        const updatedOAuthAccountRes = await trx
          .update(oauthAccountTable)
          .set({
            accessToken,
            expiresAt: accessTokenExpiresAt,
            refreshToken
          })
          .where(eq(oauthAccountTable.id, googleData.id))


        if (updatedOAuthAccountRes.rowCount === 0) {
          trx.rollback()
          return Response.json(
            { error: 'Failed to update OAuthAccountRes' },
            {
              status: 500
            }
          )
        }
      } //end of else
    }) //end of db transaction


    const session = await lucia.createSession(googleData.id, {
      expiresIn: 60 * 60 * 24 * 30
    })
    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    cookies().set('state', '', {
      expires: new Date(0)
    })
    cookies().set('codeVerifier', '', {
      expires: new Date(0)
    })

    return NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_BASE_URL),
      {
        status: 302
      }
    )
  } catch (error: any) {
    return Response.json({ error: true, message: 'Something went wrong', description: error?.message }, { status: 500 })
  }
}
