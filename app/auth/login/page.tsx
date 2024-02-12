import { LoginForm } from '@/components/auth/LoginForm'
import React from 'react'

const page = () => {
  return (
    <LoginForm
        headerLabel="Welcome to login page"
        backButtonLabel="Signup if you Don't have an account?"
        backButtonHref="/auth/register"
        showSocial
    />
  )
}

export default page