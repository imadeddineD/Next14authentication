"use client";

import { useCurrentRole } from "@/hooks/useUserRole";
import { Role } from "@prisma/client";
import { FormError } from "../FormError";



interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: Role;
};

export const RoleGate = ({
  children,
  allowedRole,
}: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    )
  }

  return (
    <>
      {children}
    </>
  );
};