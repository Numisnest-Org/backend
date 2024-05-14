import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CollectorDashboard from 'src/components/collectorProfile/CollectorDashboard'
import FavoritesComponent from 'src/components/collectorProfile/favorites'
import VisitorLayout from 'src/components/layouts/VisitorLayout'
import useAppContext from 'src/hooks/useAppContext'
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate'
import { ActionType } from 'src/utilities/context/context'
import { useSocket } from 'src/utilities/context/socketContext'
import { SellerProfileType } from 'src/utilities/types'

const CollectorProfile = () => {
  const socket = useSocket()
  const axiosCollectorPrivate = useCollectorsAxiosPrivate()
  const {state ,dispatch} = useAppContext()
  const {onlineUsers}= state;
  const [profileData, setProfileData] = useState<Partial<SellerProfileType>| null>(
    null
  );

  useEffect(()=>{
    socket.on("user online status", (data: any) => {
      console.log("user:", data);
      if(data.userid){
        console.log("saved");
        dispatch({
          type: ActionType.setOnlineUsers,
          payload: [...(onlineUsers || []), data],
        });
      }
      
    });
    console.log(onlineUsers)
    return () => {
      socket.off("user online status");
    };
  },[socket])
  
  useEffect(()=>{
    const fetchSellerProfile = async()=>{
      try {
        const response = await axiosCollectorPrivate.get(
          "duo/collector/profile/fetch"
        );
       const { data } = response.data;
       setProfileData(data);
       dispatch({ type: ActionType.setUser, payload: data });
      } catch (error) {
        
      }
    }
    fetchSellerProfile()
  },[])
  return (
    <VisitorLayout>
      <CollectorDashboard
        firstName={profileData?.first_name}
        lastName={profileData?.last_name}
        createdAt={profileData?.createdAt}
        about={profileData?.about}
        countryCode={profileData?.country_code}
        mobile={profileData?.mobile}
        url={profileData?.photo?.secure_url}
        country={profileData?.country}
        flag={profileData?.iso_code}
      />
      <FavoritesComponent />
    </VisitorLayout>
  );
}

export default CollectorProfile