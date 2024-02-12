
import NavBar from "./_components/NavBar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#28536b] to-blue-700">
      <NavBar />
      {children}
    </div>
   );
}
 
export default ProtectedLayout;