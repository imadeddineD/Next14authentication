import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
  const { data: session } = useSession();
  const user: any = session?.user || {};

  return user.role;
};









// import { User } from "@prisma/client";
// import { useSession } from "next-auth/react";

// export const useCurrentRole = () => {
//   const session = useSession() ;

//   return session.data?.user?.role
  
// }