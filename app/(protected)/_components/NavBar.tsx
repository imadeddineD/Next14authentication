"use client" 

import { UserButton } from '@/components/auth/UserButton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavBar = () => {
    const pathname = usePathname()
  return (
    <div className='fixed top-0 right-0  flex  items-center z-50
    bg-secondary  justify-between  p-4  w-full shadow-sm
    '>
     <div className="flex gap-x-2">
        <Button 
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">
            Server
          </Link>
        </Button>
        <Button 
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">
            Client
          </Link>
        </Button>
        <Button 
          asChild
          variant={pathname === "/admin" ? "default" : "outline"}
        >
          <Link href="/admin">
            Admin
          </Link>
        </Button>
        <Button 
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">
            Settings
          </Link>
        </Button>
      </div>
      <div>
      <UserButton />
      </div>
    </div>
  )
}

export default NavBar