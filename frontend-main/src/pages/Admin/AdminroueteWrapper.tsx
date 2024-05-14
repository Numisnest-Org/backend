import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAdminPrivate from "src/hooks/useAdminPrivate";
import useAppContext from "src/hooks/useAppContext";
import { ActionType } from "src/utilities/context/context";

const AdminroueteWrapper = () => {
  const adminPrivate = useAdminPrivate();
  const { dispatch } = useAppContext();
  useEffect(() => {
    const getloginDetails = async () => {
      const response = await adminPrivate.get("admin/loginfo");
      const { data } = response.data;
      dispatch({ type: ActionType.setAdminLogindetails, payload: data });
    };
    getloginDetails();
  }, []);
  return <Outlet />;
};

export default AdminroueteWrapper;
