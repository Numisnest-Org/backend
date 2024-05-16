import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SellerCollection from 'src/components/SellerProfileComponents/SellerCollection';
import SellerDashboard from 'src/components/SellerProfileComponents/SellerDashboard';
import SellerFeatured from 'src/components/SellerProfileComponents/SellerFeatured';
import SellerProfileItems from 'src/components/SellerProfileComponents/SellerProfileIItems';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import useAppContext from 'src/hooks/useAppContext';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { ActionType } from 'src/utilities/context/context';
import { useSocket } from 'src/utilities/context/socketContext';
import {
  CollectionType,
  GroupItems,
  SellerProfileType,
  SingleItemType,
} from 'src/utilities/types';

const SellerProfile = () => {
  const socket = useSocket();
  const axiosPrivate = useAxiosPrivate();
  const { state, dispatch } = useAppContext();
  const { onlineUsers } = state;
  const [profileData, setProfileData] = useState<SellerProfileType | null>(
    null
  );
  const [sellerProfileCollections, setSellerProfileCollections] = useState<
    CollectionType[] | null
  >(null);
  const [sellerProfileItems, setSellerProfileItems] = useState<
    GroupItems[] | null
  >(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    socket.on('user online status', (data: any) => {
      console.log('user:', data);
      if (data.userid) {
        console.log('saved');
        dispatch({
          type: ActionType.setOnlineUsers,
          payload: [...(onlineUsers || []), data],
        });
      }
    });

    return () => {
      socket.off('user online status');
    };
  }, [socket]);
  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const [
          sellerProfileReponse,
          sellerCollectionReponse,
          sellerItemsResponse,
        ] = await Promise.all([
          axiosPrivate.get("seller/profile/fetch"),
          axiosPrivate.get("seller/collection/fetch"),
          axiosPrivate.get("seller/seller-items?&limit=24"),
        ]);

        const { data: sellerProfile } = sellerProfileReponse.data;
        const { data: profileCollection } = sellerCollectionReponse.data;
        const { data: profileItems } = sellerItemsResponse.data;
        dispatch({ type: ActionType.setUser, payload: sellerProfile });
        setProfileData(sellerProfile);
        setSellerProfileCollections(profileCollection);
        setSellerProfileItems(profileItems.items);
      } catch (error) {}
    };
    fetchSellerProfile();
  }, [refresh]);

  return (
    <VisitorLayout>
      <SellerDashboard
        firstName={profileData?.first_name}
        lastName={profileData?.last_name}
        createdAt={profileData?.createdAt}
        about={profileData?.about}
        countryCode={profileData?.country_code}
        mobile={profileData?.mobile}
        deliveryOptions={profileData?.delivery_option}
        url={profileData?.photo.secure_url}
        country={profileData?.country}
        flag={profileData?.iso_code}
        profileDescription={profileData?.details}
      />
      <SellerFeatured id={profileData?._id} />
      <SellerCollection
        data={sellerProfileCollections}
        sellerId={profileData?._id}
      />
      <SellerProfileItems
        data={sellerProfileItems}
        setRefresh={setRefresh}
        refresh={refresh}
      />
    </VisitorLayout>
  );
};

export default SellerProfile;
