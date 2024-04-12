'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { resendVerificationEmail, SignIn, SignUp } from '@/app/actions/auth.actions';
import { useRouter } from 'next/navigation'
import { SignInSchema } from '@/app/types';
import { useEffect, useState } from 'react';
import { useCountdown, useCounter } from 'usehooks-ts';

const SignInForm = () => {

  const [showResendVerificationEmail, setShowResendVerificationEmail] = useState(false);
  const router = useRouter();
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit (values: z.infer<typeof SignInSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const res = await SignIn(values)
    if (res?.error) {
      toast({
        title: 'Error',
        description: res.error,
        duration: 5000,
        variant: 'destructive'
      })


      if (res?.key === 'email_not_verified') {
        setShowResendVerificationEmail(true)
      }

    } else if (res?.success) {
      toast({
        variant: 'default',
        description: 'Logged In Successfully'
      })

      router.push('/')
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
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

export default SignInForm;
