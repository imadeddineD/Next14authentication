"use client"

import { UserInfo } from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/useUser";

const ServerPage =  () => {
  const user = useCurrentUser()

  return ( 
    <UserInfo
      label="Client component"
      user={user}
    />
   );
}
 
export default ServerPage;