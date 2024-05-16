import { SearchOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';
import _ from 'lodash';
import { useCallback } from 'react';

interface Props {
  setState?: (value: string) => void;
  handleSearch?: () => void;
  place?:string
}

const Search = ({ setState, handleSearch, place }: Props) => {
  //  const debouncedHandleSearch = useCallback(
  //    _.debounce(() => {
  //      handleSearch();
  //    }, 500), // Adjust the debounce delay as needed (e.g., 500 milliseconds)
  //    [handleSearch]
  //  );
  const debouncedSetState = useCallback(
    _.debounce((value: string) => {
      setState && setState(value);
    }, 700), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
    [setState]
  );

  return (
    <Box
      sx={{
        // marginRight: { md: '1rem' },
        position: 'relative',
        display: 'flex',
        alignSelf: 'end',
      }}
    >
      <input
        className="record-search"
        placeholder={ place ? place : "Search"}
        onChange={(e) => {
          debouncedSetState(e.target.value);
         handleSearch;
        }}
      />
      <SearchOutlined
        className="search"
        sx={{
          fontSize: '1.7rem',
          position: 'absolute',
          right: '5%',
          top: '10px',
          color: '#0047AB',
        }}
      />
    </Box>
  );
};

export default Search;
