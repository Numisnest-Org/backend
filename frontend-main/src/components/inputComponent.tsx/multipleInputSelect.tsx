import React, { useRef, useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  Typography,
  useTheme,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import cameraicon from 'src/assets/Image/cameraicon.png';
import Image from '../Image';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import type { Identifier, XYCoord } from 'dnd-core';

import theme from 'src/utilities/theme';
import InputComponent from './InputComponent';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const ItemTypes = {
  CARD: 'card',
};
interface MultipleSelectProps {
  selectedFiles: any;
  setSelectedFiles: (val: any) => void;
  setFile: (value: File | null | string) => void;
  fileName?: File | null | any;
  xlGap?: number;
}
const MultipleInputSelect = ({
  selectedFiles,
  setSelectedFiles,
  setFile,
  fileName,
  xlGap,
}: MultipleSelectProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingFiles, setLoadingFiles] = useState<any>([]);
  const axiosPrivate = useAxiosPrivate();
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const theme = useTheme();
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newFiles = [...selectedFiles];
    const draggedItem = newFiles[dragIndex];

    newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedItem);

    setSelectedFiles(newFiles);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const formdata = new FormData();

    if (files) {
      if (selectedFiles.length + files.length > 7) {
        console.log(selectedFiles.length);
        toast(`You can only select 7 files`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          isLoading: false,
          type: 'error',
          theme: 'light',
          style: { width: '20rem', height: '7rem', fontSize: '1.3rem' },
        });
        return;
      }
      const validFiles = Array.from(files).filter((file: any) => {
        if (file.size > 5 * 1024 * 1024) {
          toast('One of the selected files is more than 5MB', {
            position: 'top-right',
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            isLoading: false,
            type: 'error',
            theme: 'light',
            style: { width: '20rem', height: '7rem', fontSize: '1.3rem' },
          });

          return false;
        }

        return true;
      });

      setIsLoading(true);
      setLoadingFiles((prevFiles: any) => [...prevFiles, ...validFiles]);

      validFiles.forEach((file, index) => {
        formdata.append(`photos`, file);
      });

      const response = await axiosPrivate.post(
        'seller/upload-photo',
        formdata,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const { data } = response.data;
      if (data[0])
        setSelectedFiles((prevFiles: any) => [...prevFiles, ...data]);

      setIsLoading(false);
    } else {
      toast(`You can only select 7 files`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'error',
        theme: 'light',
        style: { width: '20rem', height: '7rem', fontSize: '1.3rem' },
      });
    }
  };

  const handleCancel = async (index: number, public_id: string) => {
    setSelectedFiles((prevFiles: any) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });

    const response = await axiosPrivate.delete(
      `seller/del-one-photo?cloud_id=${public_id}`
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          justifyContent: 'space-between',
          justifyItems: 'center',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: `repeat(${xlGap ? xlGap : 5}, 1fr)`,
          },
          fgap: '1rem',
          overflow: 'hidden',
        }}
      >
        {selectedFiles.map((file: any, index: number) => (
          <Box
            key={index}
            sx={{
              border: '1px solid black',
              borderRadius: '2rem',
              mt: '1rem',
              width:
                index === 0
                  ? isNotMobileScreens
                    ? '20rem'
                    : '14rem'
                  : isNotMobileScreens
                  ? '15rem'
                  : '9rem',
              aspectRatio: '1',
              objectFit: 'contain',
              gridRow:
                index === 0
                  ? isNotMobileScreens
                    ? 'span 2'
                    : 'span 1'
                  : 'auto',
              gridColumn:
                index === 0
                  ? isNotMobileScreens
                    ? 'span 2'
                    : 'span 1'
                  : 'auto',
            }}
          >
            <DraggableImage
              key={index}
              file={file}
              index={index}
              handleCancel={() => handleCancel(index, file.public_id)}
              isLoading={loadingFiles.includes(index)}
              moveImage={moveImage}
            />
            {index === 0 && (
              <Typography
                textAlign={'center'}
                variant="h5"
                fontWeight={600}
                mt={'1rem'}
                mb={'1rem'}
                sx={{
                  fontSize: '1rem',
                }}
              >
                Main Photo
              </Typography>
            )}
          </Box>
        ))}
        {isLoading && (
          <Box>
            <CircularProgress size={'5rem'} sx={{ padding: '0.3rem' }} />
          </Box>
        )}
        <Box>
          {selectedFiles.length !== 7 && (
            <>
              <input
                type="file"
                id={`picture_upload`}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <IconButton>
                <InputLabel
                  htmlFor={`picture_upload`}
                  sx={{ padding: '0.3rem' }}
                >
                  <Box>
                    <Image
                      src={cameraicon}
                      alt="camera"
                      sx={{ width: '6rem', aspectRation: '1' }}
                    />
                  </Box>
                </InputLabel>
              </IconButton>
              <Typography textAlign={'center'}>Photos</Typography>
            </>
          )}
        </Box>
        <InputComponent
          pnum={6}
          acceptType="video"
          setFile={setFile}
          fileName={fileName}
        />
      </Box>
    </Box>
  );
};

const DraggableImage: React.FC<{
  file: File | any;
  index: number;
  isLoading: boolean;
  handleCancel: (index: number) => void;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}> = ({ file, index, handleCancel, isLoading, moveImage }) => {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: file.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      <img
        src={file?.size ? URL.createObjectURL(file) : file?.secure_url}
        alt={`Preview-${index + 1}`}
        style={{
          width: 'auto',
          height: '100%',
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
      {/* <Button
        onClick={() => handleCancel(index)}
        sx={{
          position: "absolute",
          top: 1,
          right: 20,
          backgroundColor: "red",
          color: "white",
          borderRadius: "50%",
          cursor: "pointer",
        }}
      >
        X
      </Button> */}
      <IconButton
        onClick={() => handleCancel(index)}
        sx={{
          position: 'absolute',
          top: 1,
          right: 20,
          backgroundColor: theme.palette.primary.light,
          color: 'white',
          borderRadius: '50%',
          cursor: 'pointer',
        }}
      >
        <DeleteOutlined />
      </IconButton>
    </div>
  );
};

export default MultipleInputSelect;
