
import { Box, Typography } from '@mui/material'
import React from 'react'
import CreateCollectionForm from 'src/components/forms/create-collection-form';
import VisitorLayout from 'src/components/layouts/VisitorLayout'

const CreateCollectionPage = () => {
  return (
    <VisitorLayout>
      <Box sx={{ mt: "4rem" }}>
        <Typography
          sx={{
            fontSize: "3rem",
            fontWeight: 700,
            mr: "2rem",
            mb: "0.5rem",
            color: "#0047AB",
            textAlign:"center"
          }}
        >
          Add a new collection
        </Typography>
        <CreateCollectionForm />
      </Box>
    </VisitorLayout>
  );
}

export default CreateCollectionPage