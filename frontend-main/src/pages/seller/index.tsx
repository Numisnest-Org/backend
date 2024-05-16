import { DataArray, RepeatOnSharp, UndoOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPublic } from "src/axios/axios";
import Collections from "src/components/Profilecomponents/Collections";
import Featured from "src/components/Profilecomponents/Featured";
import SellerProfile from "src/components/Profilecomponents/SellerProfile";
import ItemsProfile from "src/components/Profilecomponents/items";
import Items from "src/components/homeComponents/Items";
import VisitorLayout from "src/components/layouts/VisitorLayout";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import useScrollToTop from "src/hooks/useScrolllToTop";
import { defaultItems, defaultSellerItems } from "src/utilities/constants";
import {
  CollectionType,
  ItemType,
  SellerItemType,
  SingleSeller,
} from "src/utilities/types";

const SellerPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<SingleSeller | undefined>(undefined);
  const [sellerItem, setSellerItem] =
    useState<SellerItemType[]>(defaultSellerItems);
  const [sellerCollection, setSellerCollection] = useState<
    CollectionType[] | undefined
  >(undefined);
  const [featuredItems, setFeaturedItems] = useState<any[] | undefined>();
  const [isFetching,setIsFetching]= useState<boolean>(true)
  const axiosPrivate = useAxiosPrivate();
  useScrollToTop();
  useEffect(() => {
    const fetchSellerPageData = async () => {
      try {
        const [sellerFeaturedResponse] = await Promise.all([
          axiosPublic.get(`duo/collector/featured-items/${id}`),
        ]);
        const { data: featuredData } = sellerFeaturedResponse.data;
        setFeaturedItems(featuredData?.[0]);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSellerProfile = async () => {
      try {
        const response = await axiosPublic.get(
          `duo/collector/get-seller/${id}`
        );
        const { data } = response.data;
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSellerItems = async () => {
      try {
        const response = await axiosPublic.get(
          `duo/collector/seller-items/${id}?&limit=24`
        );
        const { data } = response.data;

        setSellerItem;
        data;
      } catch (error) {}finally{
        setIsFetching(false)
      }
    };
    const fetchSingleSellerCollections = async () => {
      try {
        const response = await axiosPublic.get(
          `duo/collector/seller-collections/${id}`
        );
        const { data } = response.data;
        setSellerCollection(data);
      } catch (error) {}
    };
    fetchSellerPageData();
    fetchSellerProfile();
    fetchSellerItems();
    fetchSingleSellerCollections();
  }, []);
  return (
    <VisitorLayout>
      <SellerProfile
        firstName={data?.first_name}
        lastName={data?.last_name}
        country={data?.country}
        createdAt={data?.createdAt}
        about={data?.about}
        mobile={data?.mobile}
        deliveryOptions={data?.delivery_option}
        countryCode={data?.country_code}
        url={data?.photo.secure_url}
        flag={data?.iso_code}
        profiledescription={data?.details}
        isFetching={isFetching}
      />
      <Featured data={featuredItems} />
      <Collections
        sellerCollectionData={sellerCollection}
        sellerId={data?._id}
        sellerFirstname={data?.first_name}
      />
      <ItemsProfile data={sellerItem} sellerId={data?._id} />
    </VisitorLayout>
  );
};

export default SellerPage;
