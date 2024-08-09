import { Box, Switch, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@mui/icons-material';
import cx from 'classnames';
type size = 'small' | 'large';
interface Props {
  state?: boolean;
  setState: (val: boolean) => void;
  size?: size;
  func?: () => void;
}
const ToggleSwitch = ({ state, setState }: Props) => {
  const containerVariants = {
    hidden: {
      x: '0%',
    },
    visible: {
      x: state ? '100%' : '0%',
      transition: {
        duration: 0.4,
      },
    },
  };

  const handleClick = () => {
    setState(!state);
  };

  return (
    <Box>
      <Typography sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
        <Typography
          component={'span'}
          sx={{ fontSize: '1.2rem', color: 'red' }}
        >
          Hide
        </Typography>
        /
        <Typography
          component={'span'}
          sx={{ fontSize: '1.2rem', color: 'green', fontWeight: '300' }}
        >
          Show
        </Typography>
      </Typography>
      <Box sx={{ height: '3.5rem', width: '12rem', border: '2px solid black' }}>
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          onClick={handleClick}
          sx={{
            height: '100%',
            width: '50%',
            bgcolor: state ? 'green' : 'red',
            transition: 'background-color 0.4s ease',
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default ToggleSwitch;

export const CustomSwitch = ({
  state,
  setState,
  size = 'large',
  func,
}: Props) => {
  const rounded = true;
  const sliderCx = cx('slider', {
    rounded: rounded,
  });
  const smallsliderCx = cx('smallslider', {
    rounded: rounded,
  });
  return (
    <label className={size === 'small' ? 'smallswitch' : 'switch'}>
      <input
        type="checkbox"
        className="checkbox"
        checked={state}
        onChange={(e) => {
          setState(e.target.checked);
          typeof func !== 'undefined' && func();
        }}
      />
      <span className={size === 'small' ? smallsliderCx : sliderCx} />
      <span className={state ? 'slider-text' : 'slider-text-in'}></span>
    </label>
  );
};
export const CustomSwitchClone = ({
  state,
  setState,
  size = 'large',
  func,
}: Props) => {
  const rounded = true;
  const sliderCx = cx('slider', {
    rounded: rounded,
  });
  const smallsliderCx = cx('smallsliderclone', {
    rounded: rounded,
  });
  return (
    <label className={size === 'small' ? 'smallswitchclone' : 'switch'}>
      <input
        type="checkbox"
        className="checkbox"
        checked={state}
        onChange={(e) => {
          setState(e.target.checked);
          typeof func !== 'undefined' && func();
        }}
      />
      <span className={size === 'small' ? smallsliderCx : sliderCx} />
      <span className={state ? 'slider-textclone' : 'slider-text-inclone'}></span>
    </label>
  );
};
