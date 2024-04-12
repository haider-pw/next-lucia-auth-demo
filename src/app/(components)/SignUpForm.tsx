'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { resendVerificationEmail, SignUp } from '@/app/actions/auth.actions';
import { useRouter } from 'next/navigation'
import { SignUpSchema } from '@/app/types';
import { useEffect, useState } from 'react';
import { useCountdown } from 'usehooks-ts';

const SignUpForm = () => {

  const [showResendVerificationEmail, setShowResendVerificationEmail] = useState(false);
  const countDownTime = 60;

  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: countDownTime,
    intervalMs: 1000
  })

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      resetCountdown();
    }
  }, [count])

  // const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit (values: z.infer<typeof SignUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const res = await SignUp(values)
    if (res?.error) {
      toast({
        title: 'Error',
        description: res.error,
        duration: 5000,
        variant: 'destructive'
      })
    } else if (res?.success) {
      startCountdown();
      toast({
        variant: 'default',
        description: 'We\'ve sent you an email to verify your account. Please check your inbox.'
      })
      setShowResendVerificationEmail(true);
      // router.push('/')
    }
  }

  const onResendVerificationEmail = async () => {
    const res = await resendVerificationEmail(form.getValues('email'))
    if (res?.error) {
      toast({
        title: 'Error',
        description: res.error,
        duration: 5000,
        variant: 'destructive'
      })
    } else if (res?.success) {
      toast({
        variant: 'default',
        description: 'Verification email sent'
      })
      startCountdown()
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="[Your Name]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="*****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="*****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
        {showResendVerificationEmail && <Button
          className="mt-6"
          variant={'link'}
          disabled={count > 0 && count < countDownTime}
          onClick={onResendVerificationEmail}
        >
          Send verification email {count > 0 && count < countDownTime && `in ${count}s`}
        </Button>}
      </div>
    </Form>
  )
};

export default SignUpForm;
