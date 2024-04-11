import { z } from 'zod';

export const SignUpSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(4, { message: 'Password must be at least 8 characters long' }).max(50),
  confirmPassword: z.string()
}).refine((data) => data.confirmPassword === data.password,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
)

export const SignInSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(4, { message: 'Password must be at least 8 characters long' }).max(50)
})
