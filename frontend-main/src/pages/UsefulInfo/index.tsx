import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosPublic } from 'src/axios/axios';
import InfromationCard from 'src/components/AdminComponents/AdminCards/infromationCard';
import SelectComp from 'src/components/Select/SelectComp';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import { InformationType } from 'src/utilities/types';

const UsefulInfromationPage = () => {
  const [informationList, setInformationList] = useState<InformationType[]>([]);
  const [country, setCountry] = useState<string>('');
  const [availableCountires, setAvailableCountires] = useState([]);
  useEffect(() => {
    const getusefulInformation = async () => {
      try {
        const response = await axiosPublic.get(
          `duo/general/info?country=${country}`
        );
        console.log(response);
        const { data } = response.data;
        setInformationList(data);
      } catch (error) {}
    };

    getusefulInformation();
  }, [country]);
  useEffect(() => {
    const getinfoCountry = async () => {
      try {
        const response = await axiosPublic.get(`duo/general/info/countries`);
        const { data } = response.data;
        console.log(data);
        setAvailableCountires(data);
      } catch (error) {}
    };
    getinfoCountry();
  }, []);
  return (
    <VisitorLayout>
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: { xs: '1.4rem', md: '1.6rem' },
            paddingTop: '2.2rem',
          }}
        >
          Useful Information
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            mt: '1rem',
            fontSize: { md: '1.4rem' },
          }}
        >
          Get access to useful information about numisnest here
        </Typography>
      </Box>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mt: '1rem' }}
      >
        <Typography sx={{ fontWeight: '500' }}>Showing sellers from</Typography>
        <SelectComp
          menuItems={[...availableCountires]}
          value={country}
          handleChange={(value) => setCountry(value)}
          // sx={{ my: '2rem' }}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: { xs: '1rem', md: '3rem' },
          mt: '2.4rem',
        }}
      >
        {informationList?.map((infromation) => (
          <Box>
            <InfromationCard
              title={infromation.title}
              description={infromation.description}
              key={infromation._id}
              id={infromation._id}
              cardtype="public"
            />
          </Box>
        ))}
      </Box>
    </VisitorLayout>
  );
};

export default UsefulInfromationPage;
