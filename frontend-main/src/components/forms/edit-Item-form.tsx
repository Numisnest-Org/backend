import React, { useEffect, useRef, useState } from "react";
import ModalWrapper from "../Modal/ModalWrapper";
import InputComponent from "../inputComponent.tsx/InputComponent";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import {
  Box,
  Button,
  InputAdornment,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import TextFieldInputLimit from "../form-components/TextFieldInputLimit";
import { CollectionType, SingleItemType } from "src/utilities/types";
import ToggleSwitch, {
  CustomSwitch,
} from "../AddItemsComponents/toggleISwitch";
import { toast } from "react-toastify";
import useCountryName from "src/hooks/useCountryName";
import _ from "lodash";
import MultipleInputSelect from "../inputComponent.tsx/multipleInputSelect";
import { CategoryOptions } from "../AddItemsComponents/AddItemsComp";
import MultipleSelectDropdown from "../Select/MultiselectDropdown";
import MultipleSelectDropdownCountry from "../Select/MultiselectDropdownCountry";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReactQuill from "react-quill";
interface Props {
  data?: SingleItemType;
  id?: string | undefined | null;
  closeModal?: () => void;
  setRefresh?: (val: boolean) => void;
  refresh?: boolean;
}
const EditItems = ({ data, id, closeModal, setRefresh, refresh }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [video, setvideo] = useState<File | null | string | undefined>(
    data?.video
  );
  const [title, setTitle] = useState(data?.name);
  const [description, setDescription] = useState(data?.description);
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState<number | undefined>(data?.price);
  const [category, setCategory] = useState(data?.category?.join(","));
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    ...(data?.category || []),
  ]);
  const [available, setAvailable] = useState<boolean | undefined>(
    data?.available
  );
  const [country, setCountry] = useState<string | undefined>(
    data?.country?.join(",")
  );
  const [selectedCountry, setSelectedCountry] = useState<string[]>([
    ...(data?.country || []),
  ]);const [val, setVal] = useState<any>(data?.description);
  const handleChange = (html: any) => {
    if (html.length <= 500) {
      setVal(html);
    }
  };
  const [freq, setFreqoptions] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([...(data?.photos ?? [])]);
  const [collection, setCollection] = useState<CollectionType[]>([]);
  const [year, setYear] = useState<number | null>(data?.year);
  const toggleVisibility = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailable(event.target.checked);
  };
  console.log(dayjs(data?.year));
  const quillRef = useRef<ReactQuill>(null);
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];
  const modules = {
    toolbar: false,
  };
  const handleCountryChange = (event: SelectChangeEvent<any>) => {
    const value = event.target.value;
    setSelectedCountry(typeof value === "string" ? value.split(",") : value);
    const selectedCont = selectedCountry.join(",");

    setCountry(value.join(","));
  };
  const handleChangee = (event: SelectChangeEvent<any>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
    const selectedCat = selectedCategories.join(",");

    setCategory(value.join(","));
  };
  const [selectedCOllection, setSelectedCollection] = useState<String>();
  useEffect(() => {
    const getCollections = async () => {
      try {
        const response = await axiosPrivate.get(`seller/collection/fetch`);
        const { data } = response?.data;
        setCollection(data);
      } catch (error) {
        error;
      }
    };
    const getFrequentlySelectedCoutries = async () => {
      try {
        const response = await axiosPrivate.get(
          "seller/frequently-selected-countries"
        );
        const { data } = response?.data;
        setFreqoptions(data);
      } catch (error) {}
    };
    getCollections();
    getFrequentlySelectedCoutries()
  }, []);
  const valuesSubmit = [
    { head: "name", value: title },
    { head: "description", value: val },
    { head: "currency", value: currency },
    { head: "price", value: amount },
    { head: "video", value: JSON.stringify(video) },
    { head: "available", value: available },
    { head: "country", value: country },
    { head: "category", value: category },
    { head: "year", value: year },
  ];


  const countrynames = useCountryName();
  const handleSubmit = async () => {
    localStorage.setItem("currency", currency ? currency : "");
    const formData = new FormData();
    valuesSubmit.forEach((val) => {
      if (typeof val.value === "string") {
        formData.append(val.head, val.value);
      } else if (typeof val.value === "number") {
        formData.append(val.head, val.value.toString());
      } else if (typeof val.value === "boolean") {
        formData.append(val.head, val.value.toString());
      }
    });
    formData.append("photos", JSON.stringify(selectedFiles));
    try {
      const response = await axiosPrivate.put(
        `seller/update-item/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response)
      toast("Update successful", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "success",
        theme: "light",
        style: {},
      });
      typeof closeModal !== "undefined" && closeModal();
      typeof setRefresh !== "undefined" && setRefresh(!refresh);
    } catch (error: any) {
      console.log(error)
      toast(`${error.response.data.message.split(":")[1]}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "error",
        theme: "light",
      });
    }
  };
  console.log(selectedCOllection);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "3rem" }}>
        {/* <Box sx={{display:"flex", alignItems:"center",gap:"1rem"}}>
          <Typography component={"span"}>Hide</Typography>
          <Switch
            sx={{
              transform: "scale(1.4)",
            }}
            checked ={available}
            onChange={toggleVisibility}
          />
          <Typography component={"span"}>Show</Typography>
        </Box> */}
        <CustomSwitch setState={setAvailable} state={available} />

        {/* <ToggleSwitch setState={setAvailable} state={available} /> */}
      </Box>

      <Box>
        <MultipleInputSelect
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setFile={setvideo}
          fileName={video}
          xlGap={4}
        />
      </Box>
      <Box
        sx={{
          px: {
            xs: "0.5rem",
            sm: "1rem",
            md: "2.5rem",
            lg: "4rem",
            xl: "5rem",
          },
        }}
      >
        <Box sx={{ mt: "3rem" }}>
          <TextFieldInputLimit
            limit={70}
            label={"Item Title"}
            onChange={(e) => setTitle(e.target.value)}
            val={title}
          />

          <Box
            sx={{
              mt: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component={"label"}
              sx={{
                fontSize: "1.2rem",
                fontWeight: 600,
                mr: "0.5rem",
              }}
            >
              Category:
            </Box>
            <MultipleSelectDropdown
              options={CategoryOptions}
              option={category}
              setOption={setCategory}
              selectedOptions={selectedCategories}
              setSelectedOptions={setSelectedCategories}
            />
          </Box>
          <Box
            sx={{
              mt: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component={"label"}
              sx={{
                fontSize: "1.2rem",
                fontWeight: 600,
                mr: "1.5rem",
              }}
            >
              Country:
            </Box>
            <MultipleSelectDropdownCountry
              options={[
                "Austro-Hungarian Empire",
                "Yugoslavia",
                "East Germany ",
                "Czechoslovakia",
                "South Vietnam",
                "Soviet Union",
                " West Germany ",
                "Tibet",
                " Palestine",
                " Bohemia and Moravia",
                ...countrynames,
              ]}
              countryType
              freqoptions={freq}
              option={country}
              setOption={setCountry}
              selectedOptions={selectedCountry}
              setSelectedOptions={setSelectedCountry}
            />
            {/* <Select
              multiple
              fullWidth
              value={selectedCountry}
              onChange={handleCountryChange}
              sx={{
                border: "0.79px solid rgba(0, 71, 171, 0.40)",
                width: "13rem",
                height: "2.5rem",
                fontSize: "1.12rem",
                mt: "1.5rem",
                borderRadius: "0.8rem",
              }}
            >
              {countrynames.map((country) => (
                <MenuItem value={country.toLowerCase()}>{country}</MenuItem>
              ))}
            </Select> */}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mt: "2rem",
              mb: "2rem",
            }}
          >
            <Box
              component={"label"}
              sx={{
                fontSize: { xs: "1.1rem", md: "1.2rem" },
                fontWeight: 500,
                mr: "0.5rem",
              }}
            >
              Year:
            </Box>
            <InputBase
              sx={{
                border: "0.79px solid rgba(0, 71, 171, 0.40)",
                width: "13rem",
                height: "2.5rem",
                fontSize: "1.12rem",
                borderRadius: "0.8rem",
                ml: "2.6rem",
                padding: "0.5rem 1rem",
              }}
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            />
          </Box>
          <Box sx={{ mb: "1rem" }}>
            <Box
              component={"label"}
              sx={{
                fontSize: "1.2rem",
                fontWeight: 600,
                mr: "1.5rem",
              }}
            >
              Item details
            </Box>
            
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={val}
              onChange={handleChange}
              style={{ height: "80px", maxWidth: "100%" }}
              formats={formats}
              modules={modules}
            />
          </Box>

          {/* <TextFieldInputLimit
            limit={500}
            multiline
            rows={5}
            variant="outlined"
            label={"Description"}
            val={description}
            onChange={(e) => setDescription(e.target.value)}
          /> */}

          {/* <Box sx={{ mt: "2rem" }}>
            <Box
              component={"label"}
              sx={{ fontSize: "1.5rem", fontWeight: 600, mb: "1rem" }}
            >
              Price
            </Box>
            <TextField
              sx={{
                fontSize: "1.5rem",
                "& .MuiInputAdornment-root": {
                  backgroundColor: "#F0F0F0",
                  padding: "2rem 1.5rem",
                },
              }}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ backgroundColor: "#F0F0F0" }}
                  >
                    <Typography sx={{ fontSize: "1.7rem" }}>$</Typography>
                  </InputAdornment>
                ),
              }}
              type="number"
              fullWidth
              variant="standard"
            />
          </Box> */}

          <Box
            sx={{
              mt: "2rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              component={"label"}
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                mb: "1rem",
                mt: "2rem",
              }}
            >
              Price
            </Box>
            <Box sx={{ display: "flex", width: "350px" }}>
              <TextField
                sx={{
                  fontSize: "1.5rem",
                  "& .MuiInputAdornment-root": {
                    backgroundColor: "#F0F0F0",
                    padding: "1.5rem 0.8rem",
                  },
                }}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                type="number"
                variant="outlined"
              />
              <Select
                variant="outlined"
                sx={{
                  fontSize: "1rem",
                  border: "none",
                  ml: "1rem",
                  "&:focus": {
                    backgroundColor: "transparent",
                    border: "none",
                  },
                }}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"EUR"}>EUR</MenuItem>
                <MenuItem value={"ILS"}>ILS</MenuItem>
                <MenuItem value={"RON"}>RON</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box sx={{ mt: "2rem" }}>
            <Box
              component={"label"}
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                mr: "1.2rem",
              }}
            >
              Collections :
            </Box>
            <Select
              placeholder="Select collection from available collection"
              fullWidth
              variant="outlined"
              value={selectedCOllection}
              sx={{
                border: "0.79px solid rgba(0, 71, 171, 0.40)",
                width: "13rem",
                height: "2.5rem",
                fontSize: "1.12rem",
                mt: "1.5rem",
                borderRadius: "0.8rem",
              }}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              <MenuItem>No collection</MenuItem>
              {collection.map((collect) => (
                <MenuItem value={collect?._id}>{collect.name}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Box
          component={"div"}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: "2rem",
          }}
        >
          <Button
            sx={{
              backgroundColor: "#0047AB",
              color: "white",
              padding: "0.5rem 3.8rem",
              borderRadius: "0.4rem",
              mt: "2rem",
            }}
            onClick={() => handleSubmit()}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditItems;
