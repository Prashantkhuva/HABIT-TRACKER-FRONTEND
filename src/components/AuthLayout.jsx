import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthFormSkeleton } from "./loading/LoadingSkeletons";

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
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  
  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/signin");
    } else if (!authentication && authStatus) {
      navigate("/dashboard");
    }
  }, [authStatus, navigate, authentication]);

  return <>{children}</>;
}
  export default AuthLayout;
