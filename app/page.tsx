import { Button } from '@/components/ui/button'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import { LoginButton } from '@/components/auth/LoginButton'

const font = Poppins({
  subsets : ["latin"] , 
  weight : ["600"]
})

export default function Home() {
  return (
   <main className=' flex flex-col justify-center items-center h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#28536b] to-blue-700'>
  <div className="space-y-6 text-center">
    <h1 className={cn(' text-6xl font-semibold text-white drop-shadow-md' , font.className)}>
    NextAuth.App
    </h1>
    <p className=' text-white text-lg pb-4'>This is a NextJS.v14 Application Based On Authentication</p>
    <LoginButton >
      <Button variant="secondary" size="lg" className=' text-[#333] font-semibold'>
          Get Started
      </Button>
    </LoginButton>
    </div>
   </main>
  )
}
