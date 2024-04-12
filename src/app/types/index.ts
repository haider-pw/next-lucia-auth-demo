import { z } from 'zod';

export const SignUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(4, { message: 'Password must be at least 8 characters long' }).max(50),
  confirmPassword: z.string()
}).refine((data) => data.confirmPassword === data.password,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
)

export const SignInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(4, { message: 'Password must be at least 8 characters long' }).max(50)
})
