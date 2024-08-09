import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { setToken, setUser } from "../../store/app";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAppContext from "src/hooks/useAppContext";
import LINKS from "src/utilities/links";
import { ActionType } from "src/utilities/context/context";
import { Token } from "@mui/icons-material";
import useCollectorsAxiosPrivate from "src/hooks/useCollectorsAxiosPrivate";

const ProtectedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {state ,dispatch} = useAppContext()
  const {token:contextToken}= state; 
  const axiosPrivate = useAxiosPrivate();
  const axiosCollectorPrivate = useCollectorsAxiosPrivate()
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const getLocalStoragePersist = (): null | { localToken: string | null, userType: string | null } => {
      try {
        const localToken = localStorage.getItem("token");
        const userType = localStorage.getItem("userType");

        if (localToken !== null) {
          return {localToken,userType};
        }
      } catch (error) {
        console.error("Error parsing localStorage item:", error);
      }
      return null;
    };

    const initializeAuth = async () => {
      const localstore = getLocalStoragePersist();    
      if (localstore) {
        dispatch({ type: ActionType.setLogin, payload: { token: localstore.localToken } });
        dispatch({type:ActionType.setUserType,payload:localstore.userType})
        try {
          if(localstore.userType === "seller"){
            const response = await axiosPrivate.get("seller/profile/fetch");
            dispatch({
              type: ActionType.setUser,
              payload: response.data.data,
            });
          }else{
            const response = await axiosCollectorPrivate.get(
              "duo/collector/profile/fetch"
            );
            dispatch({
              type: ActionType.setUser,
              payload: response.data.data,
            });
          }
          
        } catch (error) {
          console.log(error);
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return contextToken ? (
    <Outlet />
  ) : (
    <Navigate to={LINKS.Login} state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
