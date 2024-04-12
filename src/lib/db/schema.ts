import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default(''),
  email: text('email').unique().notNull(),
  isEmailVerified: boolean('is_email_verified').notNull().default(false),
  hashedPassword: text('hashed_password'),
  profilePictureUrl: text('profile_picture_url')
});

export const emailVerificationTable = pgTable('email_verification', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  code: text('code').notNull(),
  sentAt: timestamp('sent_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});

export const oauthAccountTable = pgTable('oauth', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  provider: text('provider').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
})

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});
