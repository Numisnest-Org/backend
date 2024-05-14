import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import TextInput from "../form-components/textInput";
import { toast } from "react-toastify";
import useCountryName from "src/hooks/useCountryName";
import { Label } from "@mui/icons-material";
import _ from "lodash";
import { Box } from "@mui/material";
export const CategoryOptions = [
    { label: "Banknotes", val: "banknote" },
    { label: "Coins", val: "coin" },
    { label: "Medals", val: "medal" },
    { label: "Stamps", val: "stamp" },
    { label: "Postcards", val: "postcard" },
    { label: "Envelopes", val: "envelope" },
    { label: "Vouchers", val: "voucher" },
    { label: "Tokens", val: "token" },
    { label: "Accessories", val: "accessories" },
    { label: "Others", val: "others" },
];
const ITEM_HEIGHT = 150;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


interface Option{
  val:string ,
  label:string
}
interface Props{
options:any[]
option:string |null |undefined,
setOption: (val:string)=>void
selectedOptions?:any
setSelectedOptions?:(val :any)=>void
admin?:boolean
defaultValue?:string
}

export default function MultipleSelectDropdown({options,option,setOption,selectedOptions,setSelectedOptions,admin,defaultValue}:Props) {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [filter, setFilter] = React.useState<string>("");
  const [isInputFocused, setIsInputFocused] = React.useState<boolean>(false);
  const countrys = useCountryName()
  
  let dataFormat;
  if (typeof options?.[0]=== "string"){
     dataFormat = countrys.map((country) => ({
      val: country.toLowerCase(),
      label: country,
    }));
  }else{
    dataFormat = options
  }
  
  const handleChange = (event: SelectChangeEvent<any>) => {
   
    if (event.target.value.length > 3) {
      toast("Can only select up to 3 catrgories", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "error",
        theme: "light",
        style: {},
      });
      return;
    }
    const {
      target: { value },
    } = event;
     if (!isInputFocused)setSelectedOptions
       ? setSelectedOptions(
           typeof value === "string" ? value.split(",") : value
         )
       : setPersonName(
           // On autofill we get a stringified value.
           typeof value === "string" ? value.split(",") : value
         );
    setOption(value.join(","))
    
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };
 const handleInputFocus = () => {
   setIsInputFocused(true);
 };

 const handleInputBlur = () => {
   setIsInputFocused(false);
 };

  const handleFilterKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Stop propagation of keyboard events to prevent automatic selection
    event.stopPropagation();
  };

  return (
    <div>
      <Select
        fullWidth={admin}
        multiple
        value={selectedOptions ? selectedOptions : personName}
        onChange={handleChange}
        defaultValue={defaultValue?defaultValue:null}
        // input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => _.upperFirst(selected.join(","))}
        MenuProps={MenuProps}
        sx={
          !admin
            ? {
                border: "0.79px solid rgba(0, 71, 171, 0.40)",
                width: "13rem",
                height: "2.5rem",
                fontSize: "1.12rem",
                borderRadius: "0.8rem",
              }
            : {}
        }
      >
        <Box sx={{px:"1rem"}}>
          <TextInput
            fullWidth
            value={filter}
            onChange={handleFilterChange}
            onKeyDown={handleFilterKeyDown}
            placeholder="search"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            autoFocus
          />
        </Box>

        {dataFormat
          ?.filter((category) =>
            category.val.toLowerCase().includes(filter.toLowerCase())
          )
          .map((filteredCategory) => (
            <MenuItem key={filteredCategory.val} value={filteredCategory.val}>
              <Checkbox
                checked={
                  selectedOptions
                    ? selectedOptions.includes(filteredCategory.val)
                    : personName.includes(filteredCategory.val)
                }
              />
              <ListItemText primary={filteredCategory.label} />
            </MenuItem>
          ))}
      </Select>
    </div>
  );
}
