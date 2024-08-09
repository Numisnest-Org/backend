import React, { useEffect, useState } from 'react'
import FavouriteSellers from 'src/components/favouritecomp/favouriteSellers';
import VisitorLayout from 'src/components/layouts/VisitorLayout'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate';
import { defaultFaves } from 'src/utilities/constants'
import { CollectorFav } from 'src/utilities/types';

const FavoritesPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const axiosCollectorPrivate = useCollectorsAxiosPrivate()
  const [isFetching,setIsFetching]=useState<boolean>(true)
  const [favorites,setFavourites] = useState<CollectorFav[]|null>(defaultFaves)
  const sellerFavorites = async ()=>{
    try {
      const response = await axiosPrivate.get(`seller/favourites`);
      const { data }: { data: any } = response.data;
      setFavourites(data)   
    } catch (error) {
      console.log(error);
    }
  }
  const collectorFavorites = async ()=>{
    try {
      const response = await axiosCollectorPrivate.get(`duo/collector/get-fav`);
      const { data }: { data: any } = response.data;
      setFavourites(data); 

      // setFeatured(data?.[0].featured_items);
    } catch (error) {
      console.log(error);
    }
  }
  const getFavorites = async ()=>{

    const userType = localStorage.getItem("userType");
    if (userType === "seller"){
      await sellerFavorites()
    }else{
      await collectorFavorites();
    }
    setIsFetching(false)
    
  }
  useEffect(()=>{
    getFavorites()
  },[])
  return (
    <VisitorLayout>
     <FavouriteSellers data={favorites} isFetching={isFetching} />
    </VisitorLayout>
  );
}

export default FavoritesPage