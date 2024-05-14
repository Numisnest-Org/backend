import { ReportProblemRounded } from "@mui/icons-material";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InfromationCard from "src/components/AdminComponents/AdminCards/infromationCard";
import AdmininformationHeader from "src/components/AdminComponents/AdmininformationHeader";
import ConfirmationModal from "src/components/Modal/are-you-sure";
import useAdminPrivate from "src/hooks/useAdminPrivate";
import { InformationType } from "src/utilities/types";

const AdminInformation = () => {
  const adminPrivate = useAdminPrivate();
  const [informationList, setInformationList] = useState<InformationType[]>();
  const [country, setCountry] = useState<string>("");
  const [isDisplayModal1, setDisplayModal1] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  console.log(selectedId);
  const [refresh, setRefresh] = useState<boolean>(true);
  useEffect(() => {
    const getInformation = async () => {
      try {
        const response = await adminPrivate.get(
          `admin/information/all?country=${country}`
        );
        const { data } = response.data;
        setInformationList(data);
      } catch (error) {}
    };
    getInformation();
  }, [country, refresh]);
  return (
    <Box sx={{ height: "100%" }}>
      {isDisplayModal1 && (
        <ConfirmationModal
          contentWidth={"400px"}
          closeModal={() => setDisplayModal1(false)}
          itemId={selectedId}
          text="delete information"
          handleItem={async () => {
            try {
              const response = await adminPrivate.delete(
                `admin/information/del/${selectedId}`
              );
              console.log(response);
              toast("Info deleted", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                isLoading: false,
                type: "success",
                theme: "light",
                style: {},
              });
              setDisplayModal1(false);
              setRefresh((prev: boolean) => !prev);
            } catch (error: any) {
              toast(`${error.response.data.message.split(":")[1]}`, {
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
            }
          }}
          icon={
            <ReportProblemRounded
              sx={{ color: " #D03531 ", fontSize: "4.5rem" }}
            />
          }
        />
      )}
      <AdmininformationHeader
        title="Useful Information"
        changeCountry={setCountry}
        country={country}
      />
      <Box
        sx={{
          height: "100%",
          mt: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          columnGap: "1rem",
          rowGap: "2rem",
        }}
      >
        {informationList?.map((infromation, index) => (
          <Box component={"div"} onClick={() => setSelectedId(infromation._id)}>
            <InfromationCard
              key={index}
              title={infromation.title}
              description={infromation.description}
              id={infromation._id}
              setDisplayModal3={setDisplayModal1}
              cardtype="Private"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AdminInformation;
