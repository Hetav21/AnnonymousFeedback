"use client"

import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function VerifyPage() {
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: values.code
            });

            const data: ApiResponse = response.data;

            toast({
                title: data.success ? 'Success' : 'Error',
                description: data.message,
                variant: data.success ? 'default' : 'destructive'
            })

            if(data.success) {
                router.replace('/signin')
            }
        } catch (e) {
            console.error(e);
            const axiosError = e as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message || 'An error occurred'
      
            toast({
              title: 'Verify Failed',
              description: errorMessage,
              variant: 'destructive'
            })      
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify Your Account
              </h1>
              <p className="mb-4">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Verify</Button>
              </form>
            </Form>
          </div>
        </div>
      );
}

export default VerifyPage