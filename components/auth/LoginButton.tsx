"use client"

import { useRouter } from "next/navigation"

interface LoginButtonProps {
  asChild? : boolean , 
  mode? : "model" | "redirect" , 
  children : React.ReactNode
}

export const LoginButton = ({
  children , 
  mode = "redirect", 
  asChild 
} : LoginButtonProps) =>{
  const router = useRouter()
  const onClick = () => {
    router.push('auth/login')
  }

  if (mode === "model") {
    return (
      <div>TODO : coming soon</div>
    )
  }
  return (
    <span className=" cursor-pointer" onClick={onClick}>{children}</span>
  )
}