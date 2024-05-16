import { Box, Typography } from '@mui/material';
import React from 'react'
import VisitorLayout from 'src/components/layouts/VisitorLayout'
import useScrollToTop from 'src/hooks/useScrolllToTop';

const DisclaimerPage = () => {
  useScrollToTop()
  return (
    <VisitorLayout>
      <Box>
        <Typography variant="h4" fontWeight={600}>
          Disclaimer of Liability:
        </Typography>
        <Typography variant="body1">
          NUMISNEST provides a platform for users to sell and buy items. We do
          not own, sell, or offer for sale any of the items listed on our site.
          Each listing is the sole responsibility of the individual user who
          posts it.
        </Typography>
        <Typography variant="body1">
          We make no representations or warranties of any kind, express or
          implied, about the completeness, accuracy, reliability, suitability,
          or availability of any items listed on our site. Any reliance you
          place on such information is therefore strictly at your own risk.
        </Typography>
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={600}>
          User Responsibility:
        </Typography>
        <Typography variant="body1">
          All transactions and interactions that occur through our website are
          the sole responsibility of the selling and buying parties. We are not
          responsible for verifying the credibility, authenticity, or quality of
          any items listed, nor are we involved in the actual transaction
          between buyers and sellers.
        </Typography>
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={600}>
          Dispute Resolution:
        </Typography>
        <Typography variant="body1">
          NUMISNEST is not liable for any disputes, claims, losses, injuries, or
          damage of any kind that might arise out of or in connection with any
          transaction, communication, or interaction initiated through our site.
        </Typography>
        <Typography variant="body1">
          By using our website, you agree to hold NUMISNEST harmless and
          indemnify us from any claims, damages, and demands of every kind,
          known or unknown, suspected and unsuspected, disclosed and
          undisclosed, arising out of or in any way connected with such
          disputes.
        </Typography>
      </Box>
    </VisitorLayout>
  );
}

export default DisclaimerPage