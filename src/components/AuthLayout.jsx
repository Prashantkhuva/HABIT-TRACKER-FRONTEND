"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { Skeleton } from "./loading/LoadingSkeletons";

// function AuthLayout({ children, authentication = true }) {
//   const navigate = useNavigate();
//   const authStatus = useSelector((state) => state.auth.status);
//   const isAuthorizedRoute = authentication ? authStatus : !authStatus;

//   useEffect(() => {
//     if (authentication && authStatus !== authentication) {
//       navigate("/signin");
//     } else if (!authentication && authStatus !== authentication) {
//       navigate("/");
//     }
//   }, [authStatus, navigate, authentication]);

//   return isAuthorizedRoute ? <>{children}</> : <AuthFormSkeleton />;
// }


function AuthLayout({ children, authentication = true }) {
  const router = useRouter();
  const { status: authStatus, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return;

    if (authentication && !authStatus) {
      router.replace("/signin");
    } else if (!authentication && authStatus) {
      router.replace("/dashboard");
    }
  }, [isAuthChecked, authStatus, router, authentication]);

  if (!isAuthChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-6">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-12 w-72 rounded-xl" />
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 rounded-[24px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
  export default AuthLayout;
