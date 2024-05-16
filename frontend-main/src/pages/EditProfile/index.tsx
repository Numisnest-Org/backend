import { Box } from '@mui/material'
import  { useEffect, useState } from 'react'
import EditProfileForm from 'src/components/forms/edit-profile'
import VisitorLayout from 'src/components/layouts/VisitorLayout'
import useAppContext from 'src/hooks/useAppContext'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate'
import { SellerProfileType } from 'src/utilities/types'
import { Spinner } from '../Item'

const EditProfilePage = () => {
  const {state,dispatch} = useAppContext()
  const {userType}= state
  const axiosPrivate = useAxiosPrivate()
  const [userProfile,setUserProfile]=useState<Partial<SellerProfileType> |null>(null)
  const axiosCollectorsPrivate = useCollectorsAxiosPrivate()
   const [isFetching, setIsFetching] = useState(true);
  useEffect(()=>{
    const fetchUserProfile = async()=>{
      try {
        if (userType === "seller") {
          const response = await axiosPrivate.get("seller/profile/fetch");
          const { data } = response.data;
          setUserProfile(data);
        } else {
          const response = await axiosPrivate.get(
            "duo/collector/profile/fetch"
          );
          const { data } = response.data;
          setUserProfile(data);
        }
      } catch (error) {
        
      }finally{
        setIsFetching(false)
      }
      
    }
    fetchUserProfile()
  },[])
  console.log(userProfile)
  return (
    <VisitorLayout>
      {isFetching ? (
        <Box sx={{display:"flex",justifyContent:"center",mt:"4rem"}}>
          
          <Spinner />
        </Box>
      ) : (
        <EditProfileForm
          firstName={userProfile?.first_name}
          lastName={userProfile?.last_name}
          Country={userProfile?.country}
          CountryCode={userProfile?.country_code}
          PhoneNumber={userProfile?.mobile}
          About={userProfile?.about}
          DeliveryOption={userProfile?.delivery_option}
          profile_photo={userProfile?.photo?.secure_url}
          profiledescription={userProfile?.details}
        />
      )}
    </VisitorLayout>
  );
}

export default EditProfilePage