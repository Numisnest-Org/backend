import { Box, Divider, IconButton, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  CloseOutlined,
  MoreHorizOutlined,
  ReportProblemRounded,
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';
import { CardType } from './Adminitemscard';
interface Props {
  title?: string;
  description: string | Node;
  id: string;
  openModal?: () => void;
  setDisplayModal3?: (val: boolean) => void;
  cardtype: CardType;
}
const InfromationCard = ({
  title,
  description,
  id,
  cardtype = 'Private',
  setDisplayModal3,
}: Props) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const config = {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'a',
      'br',
      'strong',
      'em',
      'ul',
      'ol',
      'li',
    ],
    ALLOWED_ATTRS: {
      '*': ['class'],
      a: ['href', 'target', 'rel'], // Allow target and rel attributes for links
    },
  };
  const sanitizedDescription = DOMPurify.sanitize(description, config);
  console.log(sanitizedDescription);
  const handleDescriptionClick = (event: any) => {
    if (event.target.tagName === 'A' && event.target.target !== '_blank') {
      event.preventDefault();
      window.open(event.target.href, '_blank');
    }
  };
  return (
    <Box
      sx={{
        py: '20px',
        px: '10px',
        backgroundColor: '#fff',
        borderRadius: '.3rem',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white',
          borderRadius: '.5rem',
          border: '1px solid #E6E9F9',
          p: '1rem',
          px: '2rem',
          boxShadow: '2px 2px 2px #cccc',
          height: '100%',
        }}
      >
        {cardtype === 'Private' && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              sx={{
                position: 'absolute',
                right: 5,
                top: 10,
              }}
              onClick={() => setShowDialog(true)}
            >
              <MoreHorizOutlined sx={{ fontSize: '2rem', color: '#0047AB' }} />
            </IconButton>
            <AnimatePresence>
              {showDialog && (
                <Box
                  sx={{
                    width: '9rem',
                    height: '8rem',
                    position: 'absolute',
                    bgcolor: '#F4F4F6',
                    transformOrigin: 'top right',
                    borderRadius: '0.3rem',
                    right: 25,
                    top: 22,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    when: 'beforeChildren',
                    staggerChildren: 0.2,
                  }}
                  exit={{ scale: 0 }}
                  component={motion.div}
                >
                  <Box sx={{ position: 'relative', display: '' }}>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: -5,
                        top: -5,
                        color: '#0047AB',
                      }}
                      onClick={() => setShowDialog(false)}
                    >
                      <CloseOutlined />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      mt: '1.5rem',
                    }}
                  >
                    <Typography
                      component={motion.div}
                      sx={{ fontSize: '1rem' }}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      onClick={() =>
                        navigate(`${LINKS.admininformationtext}?infoid=${id}`)
                      }
                    >
                      {' '}
                      Edit
                    </Typography>
                    <Divider />
                    <Typography
                      component={motion.div}
                      sx={{ fontSize: '1rem' }}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      onClick={() =>
                        typeof setDisplayModal3 !== 'undefined' &&
                        setDisplayModal3(true)
                      }
                    >
                      {' '}
                      Delete
                    </Typography>
                  </Box>
                </Box>
              )}
            </AnimatePresence>
          </Box>
        )}

        <Box>
          <Typography
            variant="h5"
            sx={{
              bgcolor: '#0047AB',
              color: 'white',
              textAlign: 'center',
              p: '0.5rem',
              py: '0.8rem',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              fontSize: { xs: '0.8rem', md: '1.2rem' },
            }}
          >
            {' '}
            {title}
          </Typography>

          <Typography
            component={'div'}
            sx={{ mt: '2rem', overflow: 'hidden' }}
            onClick={handleDescriptionClick}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description, config),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InfromationCard;
