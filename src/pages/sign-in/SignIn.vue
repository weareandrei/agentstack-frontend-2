<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSignIn } from './useSignIn'

const { email, password, isLoading, errorMessage, onSubmit } = useSignIn()
</script>

<template>
  <div class="flex justify-center px-4 pt-20">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Welcome back. Enter your details.</CardDescription>
      </CardHeader>

      <form @submit.prevent="onSubmit">
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" placeholder="you@example.com" required />
          </div>

          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" v-model="password" type="password" required />
          </div>

          <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
        </CardContent>

        <CardFooter class="mt-4">
          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Signing in…' : 'Sign in' }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
