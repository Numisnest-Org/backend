import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "src/components/Image";
import useAppContext from "src/hooks/useAppContext";
import backIcon from "src/assets/Image/AdminIcons/backIcon.png";
import dayjs from "dayjs";
import TextInput from "src/components/form-components/textInput";
import useCountryName from "src/hooks/useCountryName";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAdminPrivate from "src/hooks/useAdminPrivate";
import LINKS from "src/utilities/links";
import { InformationType } from "src/utilities/types";
import MultipleSelectDropdown from "src/components/Select/MultiselectDropdown";
const AddInformationText = () => {
  const quillRef = useRef<ReactQuill>(null);
  const { state } = useAppContext();
  const { adminloginDetails } = state;
  const [info, setInfo] = useState<InformationType>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<string>(info ? info.title : "");
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [val, setVal] = useState<any>("");
  const countrynames = useCountryName();
  const adminPrivate = useAdminPrivate();
  const handleCountryChange = (event: SelectChangeEvent<any>) => {
    const value = event.target.value;
    setSelectedCountry(typeof value === "string" ? value.split(",") : value);
    const selectedCont = selectedCountry.join(",");
    setCountry(value.join(","));
  };
  const queryParamas = new URLSearchParams(window.location.search);
  const infoId = queryParamas.get("infoid");

  const handleLinkModification = (html:any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const links = doc.querySelectorAll("a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank"); 
    });

    const newContent = doc.body.innerHTML;
    return newContent;
  };
const handleChange = (html:any) => {
  const modifiedContent = handleLinkModification(html);
  console.log(modifiedContent)
  setVal(modifiedContent);
};
 
  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await adminPrivate.get(
          `admin/information/one/${infoId}`
        );
        const { data } = response.data;
        setInfo(data);
      } catch (error) {}
    };
    if (infoId) getInfo();
  }, [infoId]);
  useEffect(() => {
   
    if (info) {
      setTopic(info.title || "");
      setSelectedCountry(info.country);
      setCountry(info.country.join() || "");
      setVal(info.description || "");
    }
  }, [info]);
  

  const submitTopic = async () => {
    try {
      const response = await adminPrivate.post("admin/information/add", {
        title: topic,
        country: country,
        description: val,
      });
     
      navigate(LINKS.adminInformation);
    } catch (error) {
      
    }
  };
  const editTopic = async () => {
    try {
      const response = await adminPrivate.put(
        `admin/information/edit/${infoId}`,
        { title: topic, country: country, description: val }
      );
      navigate(LINKS.adminInformation);
    } catch (error) {}
  };
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

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
  
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ marginRight: "1rem" }} onClick={() => navigate(-1)}>
            <Image
              src={backIcon}
              alt="backicon"
              className="back-icon"
              sx={{
                width: "2.125rem",
                height: "3.1875rem",
                flexShrink: 0,
              }}
            />
          </IconButton>
          <Typography
            sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0047AB" }}
          >
            Messages
          </Typography>
        </Box>
        <Box>
          <Typography>
            Current IP:{" "}
            <Typography component={"span"}>
              {" "}
              {adminloginDetails?.ip_address}
            </Typography>
          </Typography>
          <Typography>
            Last Login:
            <Typography component={"span"}>
              {" "}
              {dayjs(adminloginDetails?.last_login).format("D MMMM, YYYY")}
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Box>
        <Stack
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            columnGap: "2rem",
          }}
        >
          <Box sx={{ mt: "2rem" }}>
            <Box
              component={"label"}
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                mb: "1rem",
                mr: "1.5rem",
              }}
            >
              Topic Name
            </Box>
            <TextInput
              fullWidth
              placeholder={"Enter topic name "}
              name="email"
              value={topic}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTopic(e.target.value)
              }
            />
          </Box>

          <Box sx={{ mt: "2rem" }}>
            <Box
              component={"label"}
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                mb: "1rem",
                mr: "1.5rem",
              }}
            >
              Country
            </Box>
            <MultipleSelectDropdown
              options={countrynames}
              option={country}
              setOption={setCountry}
              admin
            />
            {/* <Select
              multiple
              fullWidth
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              {countrynames.map((country, index) => (
                <MenuItem key={index} value={country.toLowerCase()}>
                  {country}
                </MenuItem>
              ))}
            </Select> */}
          </Box>
        </Stack>

        <Box sx={{ mt: "2rem" }}>
          <Box
            component={"label"}
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              mb: "1rem",
              mr: "1.5rem",
            }}
          >
            Desciption
          </Box>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={val}
            onChange={handleChange}
            style={{ height: "300px", maxWidth: "100%" }}
            
            formats={formats}
          />
        </Box>
      </Box>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button
          sx={{
            mt: "3.5rem",
            backgroundColor: "#0047AB",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.7rem",
          }}
          onClick={infoId ? editTopic : submitTopic}
        >
          {infoId ? "Edit Topic" : "Create Topic"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddInformationText;
