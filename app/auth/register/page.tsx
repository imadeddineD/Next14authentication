import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import React from 'react'

const page = () => {
  return (
    <RegisterForm
        headerLabel="Welcome to register page"
        backButtonLabel="Login if you have an account?"
        backButtonHref="/auth/login"
        showSocial
    />
  )
}

export default page