import { NewPasswordForm } from '@/components/auth/NewPasswordForm'
import React from 'react'

const page = () => {
  return (
    <NewPasswordForm
    headerLabel="New Password Here !"
    backButtonLabel="Back to login"
    backButtonHref="/auth/login" 
    />
  )
}

export default page