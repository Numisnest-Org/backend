import React, { useEffect } from 'react'
import useAppContext from './useAppContext';
import { axiosPublic } from 'src/axios/axios';

const useCollectorsAxiosPrivate = () => {
  const getLocalStoragePersist = (): null | {
    localToken: string | null;
    userType: string | null;
  } => {
    try {
      const localToken = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (localToken !== null) {
        return { localToken, userType };
      }
    } catch (error) {
      console.error("Error parsing localStorage item:", error);
    }
    return null;
  };
  const getstorage = getLocalStoragePersist();
  const { state } = useAppContext();
  const { token } = state;
  // console.log(token)
  useEffect(() => {
    const requestIntercept = axiosPublic.interceptors.request.use(
      (config) => {
        if (!config.headers["collector-auth"]) {
          config.headers["collector-auth"] = `${
            token ? token : getstorage?.localToken
          }`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      axiosPublic.interceptors.request.eject(requestIntercept);
    };
  }, []);
  return axiosPublic;
}

export default useCollectorsAxiosPrivate