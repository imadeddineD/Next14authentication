import { db } from "@/lib/db";

const AuthLayout = ({ 
    children
  }: { 
    children: React.ReactNode
  }) => {
    return ( 
      <div className=" py-10 min-h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#28536b] to-blue-700">
        {children}
      </div>
     );
  }
   
  export default AuthLayout;