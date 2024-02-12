import { ResetForm } from '@/components/auth/ResetForm'
import React from 'react'

const page = () => {
  return (
    <ResetForm
    headerLabel="Forgot your password?"
    backButtonLabel="Back to login"
    backButtonHref="/auth/login"
    />  )
}

export default page