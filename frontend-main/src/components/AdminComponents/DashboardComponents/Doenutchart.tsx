import { Box, Paper, Typography } from "@mui/material";
import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { categories } from "src/utilities/constants";
import { calculateChartData } from "src/utilities/constants/helpers";
import { ApexOptions } from "apexcharts";

interface Props {
  data: any[];
}

const Doenutchart = ({ data }: Props) => {
  console.log(data);
  const catergoriesLabel = useMemo(
    () => categories.map((cat) => cat.label),
    [categories]
  );

  const chartData = useMemo(() => calculateChartData(data, categories), [data]);
  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      width: 100,
      height: 100,
    },
    labels: catergoriesLabel,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 0,
        options: {
          chart: {
            width: 200,
            height: 200,
          },
          legend: {
            position: "top",
          },
        },
      },
      {
        breakpoint: 600,
        options: {
          chart: {
            width: 200,
            height: 200,
          },
          legend: {
            position: "top",
          },
        },
      },
      {
        breakpoint: 900,
        options: {
          chart: {
            width: 400,
            height: 300,
          },
          legend: {
            position: "right",
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          chart: {
            width: 500,
            height: 400,
          },
          legend: {
            position: "left",
          },
        },
      },
      {
        breakpoint: 1500,
        options: {
          chart: {
            width: 600,
            height: 600,
          },
          legend: {
            position: "right",
          },
        },
      },
    ],
  };

  // (data)
  // const chartData:number[] = []
  // categories.map((category)=>{
  //  const found:any = data.find((cati)=>(
  //     cati._id ===category.val
  //   ))
  //   chartData.push(found?.categ_items.length);
  // })

  return (
    <Paper
      sx={{ borderRadius: "1rem", ml: "2rem", width: "100%", pl: "1.5rem" }}
    >
      <Typography
        sx={{ color: "#0047AB", fontSize: "1.5rem", fontWeight: "bold" }}
      >
        Total Items by Categories
      </Typography>
      <Box sx={{ width: "42rem" }}>
        <ReactApexChart
          options={chartOptions}
          series={chartData}
          type="donut"
        />
      </Box>
    </Paper>
  );
};

export default Doenutchart;
